package com.radium.gulimallthirdpart.oss.cloud;

import org.apache.commons.lang3.StringUtils;

import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * 文件存储抽象：COS 与本地磁盘两种实现共用同一套 upload/uploadSuffix 接口。
 */
public abstract class CloudStorageService {
    private static final DateTimeFormatter DATE_DIR = DateTimeFormatter.ofPattern("yyyyMMdd");

    /** 云存储配置信息 */
    CloudStorageConfig config;

    /**
     * 生成对象路径：prefix/yyyyMMdd/uuid + suffix
     */
    public String getPath(String prefix, String suffix) {
        String uuid = UUID.randomUUID().toString().replaceAll("-", "");
        String path = LocalDate.now().format(DATE_DIR) + "/" + uuid;
        if (StringUtils.isNotBlank(prefix)) {
            path = prefix + "/" + path;
        }
        return path + suffix;
    }

    public abstract String upload(byte[] data, String path);

    public abstract String uploadSuffix(byte[] data, String suffix);

    public abstract String upload(InputStream inputStream, String path);

    public abstract String uploadSuffix(InputStream inputStream, String suffix);
}
