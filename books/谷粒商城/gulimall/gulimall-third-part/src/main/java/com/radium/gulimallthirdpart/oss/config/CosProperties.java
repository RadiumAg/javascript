package com.radium.gulimallthirdpart.oss.config;

import com.radium.gulimallthirdpart.oss.cloud.CloudStorageConfig;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 腾讯云 COS 配置，全部填齐才走 COS，否则本地存储兜底。
 */
@Data
@Component
@ConfigurationProperties(prefix = "gulimall.cos")
public class CosProperties {
    private String appId;
    private String secretId;
    private String secretKey;
    private String region;
    private String bucket;
    private String domain;
    private String prefix;

    public boolean isConfigured() {
        return StringUtils.isNotBlank(secretId)
                && StringUtils.isNotBlank(secretKey)
                && StringUtils.isNotBlank(region)
                && StringUtils.isNotBlank(bucket)
                && StringUtils.isNotBlank(domain);
    }

    public CloudStorageConfig toCloudStorageConfig() {
        CloudStorageConfig config = new CloudStorageConfig();
        config.setQcloudAppId(StringUtils.isBlank(appId) ? null : Integer.valueOf(appId));
        config.setQcloudSecretId(secretId);
        config.setQcloudSecretKey(secretKey);
        config.setQcloudRegion(region);
        config.setQcloudBucketName(bucket);
        config.setQcloudDomain(domain);
        config.setQcloudPrefix(prefix);
        return config;
    }
}
