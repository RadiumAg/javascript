package com.radium.gulimallthirdpart.oss.cloud;

import lombok.Data;

import java.io.Serializable;

/**
 * 腾讯云 COS 存储配置。第三方服务只用 COS，不再背 renren 的七牛/阿里云字段。
 */
@Data
public class CloudStorageConfig implements Serializable {
    private static final long serialVersionUID = 1L;

    /** COS 绑定的自定义域名（回显 URL 前缀） */
    private String qcloudDomain;
    /** 对象 key 前缀 */
    private String qcloudPrefix;
    /** COS AppId */
    private Integer qcloudAppId;
    private String qcloudSecretId;
    private String qcloudSecretKey;
    private String qcloudBucketName;
    /** COS 所属地区，如 ap-guangzhou */
    private String qcloudRegion;
}
