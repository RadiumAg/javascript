package com.radium.gulimallthirdpart.oss.cloud;

import com.qcloud.cos.COSClient;
import com.qcloud.cos.ClientConfig;
import com.qcloud.cos.auth.BasicCOSCredentials;
import com.qcloud.cos.auth.COSCredentials;
import com.qcloud.cos.exception.CosClientException;
import com.qcloud.cos.model.ObjectMetadata;
import com.qcloud.cos.model.PutObjectRequest;
import com.qcloud.cos.region.Region;
import com.radium.gulimall.common.exception.GulimallException;
import org.apache.commons.lang3.StringUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * 腾讯云 COS 存储（后端转发上传）。
 */
public class QcloudCloudStorageService extends CloudStorageService {
    private final COSClient client;
    private final String bucketName;

    public QcloudCloudStorageService(CloudStorageConfig config) {
        this.config = config;

        COSCredentials credentials = new BasicCOSCredentials(
                config.getQcloudSecretId(), config.getQcloudSecretKey());
        ClientConfig clientConfig = new ClientConfig(new Region(config.getQcloudRegion()));
        this.client = new COSClient(credentials, clientConfig);

        // COS 5.x 的 bucket 名需要带 APPID 后缀
        Integer appId = config.getQcloudAppId();
        String appIdSuffix = appId == null ? "" : "-" + appId;
        String bucket = config.getQcloudBucketName();
        this.bucketName = StringUtils.isBlank(appIdSuffix) || bucket.endsWith(appIdSuffix)
                ? bucket : bucket + appIdSuffix;
    }

    @Override
    public String upload(byte[] data, String path) {
        if (!path.startsWith("/")) {
            path = "/" + path;
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(data.length);

        try {
            client.putObject(new PutObjectRequest(
                    bucketName, path.substring(1), new ByteArrayInputStream(data), metadata));
        } catch (CosClientException e) {
            throw new GulimallException(500, "文件上传失败，" + e.getMessage());
        }

        String domain = config.getQcloudDomain();
        if (domain.endsWith("/")) {
            domain = domain.substring(0, domain.length() - 1);
        }
        return domain + path;
    }

    @Override
    public String upload(InputStream inputStream, String path) {
        try {
            return upload(inputStream.readAllBytes(), path);
        } catch (IOException e) {
            throw new GulimallException(500, "上传文件失败");
        }
    }

    @Override
    public String uploadSuffix(byte[] data, String suffix) {
        return upload(data, getPath(config.getQcloudPrefix(), suffix));
    }

    @Override
    public String uploadSuffix(InputStream inputStream, String suffix) {
        return upload(inputStream, getPath(config.getQcloudPrefix(), suffix));
    }
}
