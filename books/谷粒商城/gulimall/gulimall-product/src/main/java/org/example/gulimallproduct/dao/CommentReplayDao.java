package org.example.gulimallproduct.dao;

import org.example.gulimallproduct.entity.CommentReplayEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 商品评价回复关系
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-21 20:33:18
 */
@Mapper
public interface CommentReplayDao extends BaseMapper<CommentReplayEntity> {
	
}
