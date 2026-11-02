package com.radium.gulimallthirdpart.oss.service;

import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.auth.COSSigner;
import com.qcloud.cos.http.HttpMethodName;
import com.radium.gulimall.common.exception.GulimallException;
import com.radium.gulimallthirdpart.oss.cloud.CloudStorageConfig;
import com.radium.gulimallthirdpart.oss.cloud.LocalCloudStorageService;
import com.radium.gulimallthirdpart.oss.cloud.QcloudCloudStorageService;
import com.radium.gulimallthirdpart.oss.config.CosProperties;
import com.radium.gulimallthirdpart.oss.config.UploadProperties;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImageUploadService {
    @Autowired
    private UploadProperties uploadProperties;
    @Autowired
    private CosProperties cosProperties;

    private static final List<String> ALLOWED_EXTS =
            Arrays.asList("jpg", "jpeg", "png", "gif", "webp", "bmp");

    /** 后端转发上传：配了 COS 走 COS，否则落本地磁盘 */
    public String upload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new GulimallException(500, "上传文件不能为空");
        }
        if (file.getSize() > uploadProperties.getMaxSizeMb() * 1024 * 1024) {
            throw new GulimallException(500, "图片大小不能超过" + uploadProperties.getMaxSizeMb() + "MB");
        }

        String ext = resolveExt(file.getOriginalFilename());
        if (!ALLOWED_EXTS.contains(ext)) {
            throw new GulimallException(500, "只支持 jpg/jpeg/png/gif/webp/bmp 格式");
        }

        try {
            byte[] data = file.getBytes();
            if (cosProperties.isConfigured()) {
                return new QcloudCloudStorageService(cosProperties.toCloudStorageConfig())
                        .uploadSuffix(data, "." + ext);
            }
            return new LocalCloudStorageService(uploadProperties.getPath(), uploadProperties.getUrlPrefix())
                    .uploadSuffix(data, "." + ext);
        } catch (IOException e) {
            throw new GulimallException(500, "上传文件失败");
        }
    }

    /**
     * COS 直传签名：生成对象 key 并对 PUT 请求签名，浏览器拿到后直接上传，文件不经过本服务。
     */
    public Map<String, Object> buildCosSignature(String ext) {
        if (!cosProperties.isConfigured()) {
            throw new GulimallException(500, "未配置腾讯云COS，请使用后端转发上传");
        }
        String normalized = StringUtils.trimToEmpty(ext).toLowerCase();
        if (normalized.startsWith(".")) {
            normalized = normalized.substring(1);
        }
        if (!ALLOWED_EXTS.contains(normalized)) {
            throw new GulimallException(500, "只支持 jpg/jpeg/png/gif/webp/bmp 格式");
        }

        CloudStorageConfig config = cosProperties.toCloudStorageConfig();
        // COS 5.x 的 bucket 名需要带 APPID 后缀
        String bucketName = cosProperties.getBucket();
        String appId = cosProperties.getAppId();
        if (StringUtils.isNotBlank(appId) && !bucketName.endsWith("-" + appId)) {
            bucketName = bucketName + "-" + appId;
        }

        QcloudCloudStorageService storage = new QcloudCloudStorageService(config);
        String key = storage.getPath(config.getQcloudPrefix(), "." + normalized);

        String domain = config.getQcloudDomain();
        if (domain.endsWith("/")) {
            domain = domain.substring(0, domain.length() - 1);
        }

        // 签名 10 分钟内有效；只签 host，浏览器额外带的 Content-Type 等头部不参与校验
        Date expireTime = new Date(System.currentTimeMillis() + 10 * 60 * 1000L);
        String host = bucketName + ".cos." + cosProperties.getRegion() + ".myqcloud.com";
        Map<String, String> headers = new HashMap<>();
        headers.put("host", host);
        COSCredentials credentials = new BasicCOSCredentials(
                config.getQcloudSecretId(), config.getQcloudSecretKey());
        String authorization = new COSSigner().buildAuthorizationStr(
                HttpMethodName.PUT, "/" + key, headers, new HashMap<String, String>(), credentials, expireTime);

        Map<String, Object> ticket = new HashMap<>();
        ticket.put("bucket", bucketName);
        ticket.put("region", cosProperties.getRegion());
        ticket.put("key", key);
        ticket.put("url", domain + "/" + key);
        ticket.put("uploadUrl", "https://" + host + "/" + key);
        ticket.put("authorization", authorization);
        ticket.put("expiredTime", expireTime.getTime());
        return ticket;
    }

    private String resolveExt(String filename) {
        if (StringUtils.isBlank(filename)) {
            return "";
        }
        int dot = filename.lastIndexOf('.');
        return dot < 0 ? "" : filename.substring(dot + 1).toLowerCase();
    }
}
