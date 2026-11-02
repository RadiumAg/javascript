package com.radium.gulimallthirdpart.oss.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 图片上传配置：未配置 COS 时落本地磁盘。
 */
@Data
@Component
@ConfigurationProperties(prefix = "gulimall.upload")
public class UploadProperties {
    /** 本地存储根目录 */
    private String path = "gulimall-upload";
    /** 本地文件对外访问 URL 前缀，指向第三方服务的回显接口（经网关原样透传） */
    private String urlPrefix = "/gulimallthirdpart/upload/file";
    /** 图片大小上限，单位 MB */
    private long maxSizeMb = 5;
}
