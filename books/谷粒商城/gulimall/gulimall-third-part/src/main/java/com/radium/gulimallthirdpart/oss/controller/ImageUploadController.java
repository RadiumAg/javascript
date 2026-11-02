package com.radium.gulimallthirdpart.oss.controller;

import com.radium.gulimall.common.utils.R;
import com.radium.gulimallthirdpart.oss.config.UploadProperties;
import com.radium.gulimallthirdpart.oss.service.ImageUploadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("gulimallthirdpart/upload")
public class ImageUploadController {
    @Autowired
    private ImageUploadService imageUploadService;
    @Autowired
    private UploadProperties uploadProperties;

    private static final Map<String, MediaType> MEDIA_TYPES = new HashMap<>();
    static {
        MEDIA_TYPES.put("png", MediaType.IMAGE_PNG);
        MEDIA_TYPES.put("jpg", MediaType.IMAGE_JPEG);
        MEDIA_TYPES.put("jpeg", MediaType.IMAGE_JPEG);
        MEDIA_TYPES.put("gif", MediaType.IMAGE_GIF);
        MEDIA_TYPES.put("webp", MediaType.parseMediaType("image/webp"));
        MEDIA_TYPES.put("bmp", MediaType.parseMediaType("image/bmp"));
    }

    /** 后端转发上传：未配 COS 时落本地磁盘，配了则转发到 COS */
    @PostMapping("/image")
    public R image(@RequestParam("file") MultipartFile file) {
        String url = imageUploadService.upload(file);
        return R.ok().put("url", url);
    }

    /**
     * 超过 spring.servlet.multipart 上限时，Tomcat 在进 controller 前就抛异常，
     * 这里兜住给出和 service 校验一致的可读提示，而不是通用 500。
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public R handleMaxUploadSize(MaxUploadSizeExceededException e) {
        return R.error(500, "图片大小不能超过" + uploadProperties.getMaxSizeMb() + "MB");
    }

    /** 腾讯云 COS 直传签名：前端拿签名后把文件直接 PUT 到 COS，文件不经过本服务 */
    @GetMapping("/cos-signature")
    public R cosSignature(@RequestParam(value = "ext", defaultValue = "png") String ext) {
        return R.ok(imageUploadService.buildCosSignature(ext));
    }

    /** 本地存储的文件回显（COS 模式下不会走到这里）；匿名可访问，供 <img> 直接加载 */
    @GetMapping("/file/{date}/{name}")
    public ResponseEntity<Resource> file(@PathVariable("date") String date,
                                         @PathVariable("name") String name) {
        if (!date.matches("\\d{8}") || !name.matches("[0-9a-f]{32}\\.[a-zA-Z]{3,4}")) {
            return ResponseEntity.notFound().build();
        }

        Path baseDir = Paths.get(uploadProperties.getPath()).toAbsolutePath().normalize();
        Path file = baseDir.resolve(date).resolve(name).normalize();
        if (!file.startsWith(baseDir) || !Files.exists(file)) {
            return ResponseEntity.notFound().build();
        }

        String ext = name.substring(name.lastIndexOf('.') + 1).toLowerCase();
        MediaType mediaType = MEDIA_TYPES.getOrDefault(ext, MediaType.APPLICATION_OCTET_STREAM);
        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(new FileSystemResource(file));
    }
}
