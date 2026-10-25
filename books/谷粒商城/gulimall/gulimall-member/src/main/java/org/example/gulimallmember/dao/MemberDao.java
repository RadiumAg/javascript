package org.example.gulimallmember.dao;

import org.example.gulimallmember.entity.MemberEntity;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 会员
 * 
 * @author chenshun
 * @email sunlightcs@gmail.com
 * @date 2026-10-25 19:41:32
 */
@Mapper
public interface MemberDao extends BaseMapper<MemberEntity> {
	
}
