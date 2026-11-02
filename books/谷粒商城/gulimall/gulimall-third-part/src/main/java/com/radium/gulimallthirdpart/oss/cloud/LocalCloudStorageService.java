package com.radium.gulimallthirdpart.oss.cloud;

import com.radium.gulimall.common.exception.GulimallException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * 本地磁盘存储（未配 COS 时兜底）：文件落在 baseDir/yyyyMMdd/uuid.ext，访问 URL 为 urlPrefix/路径。
 */
public class LocalCloudStorageService extends CloudStorageService {
    private final Path baseDir;
    private final String urlPrefix;

    public LocalCloudStorageService(String path, String urlPrefix) {
        this.baseDir = Paths.get(path).toAbsolutePath().normalize();
        this.urlPrefix = urlPrefix;
    }

    @Override
    public String upload(byte[] data, String path) {
        Path target = baseDir.resolve(path).normalize();
        if (!target.startsWith(baseDir)) {
            throw new GulimallException(500, "非法文件路径");
        }
        try {
            Files.createDirectories(target.getParent());
            Files.write(target, data);
        } catch (IOException e) {
            throw new GulimallException(500, "上传文件失败");
        }
        return urlPrefix + "/" + path;
    }

    @Override
    public String uploadSuffix(byte[] data, String suffix) {
        return upload(data, getPath(null, suffix));
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
    public String uploadSuffix(InputStream inputStream, String suffix) {
        return upload(inputStream, getPath(null, suffix));
    }
}
