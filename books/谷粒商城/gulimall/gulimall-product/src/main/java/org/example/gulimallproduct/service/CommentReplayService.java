package org.example.gulimallproduct.service;

import com.baomidou.mybatisplus.extension.service.IService;
import org.example.gulimall.common.utils.PageUtils;
import org.example.gulimallproduct.entity.CommentReplayEntity;

import java.util.Map;

/**
 * 商品评价回复关系
 *
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
public interface CommentReplayService extends IService<CommentReplayEntity> {

    PageUtils queryPage(Map<String, Object> params);
}

