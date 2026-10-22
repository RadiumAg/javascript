package org.example.gulimall.common.utils;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.util.Map;

public class Query<T> {

    private static final long DEFAULT_PAGE = 1;
    private static final long DEFAULT_LIMIT = 10;

    public IPage<T> getPage(Map<String, Object> params) {
        long curPage = parseLong(params.get("page"), DEFAULT_PAGE);
        long limit = parseLong(params.get("limit"), DEFAULT_LIMIT);

        Page<T> page = new Page<>(curPage, limit);

        String sidx = str(params.get("sidx"));
        String order = str(params.get("order"));
        if (!sidx.isEmpty() && !order.isEmpty()) {
            page.addOrder("asc".equalsIgnoreCase(order)
                    ? OrderItem.asc(sidx)
                    : OrderItem.desc(sidx));
        }
        return page;
    }

    private long parseLong(Object value, long defaultValue) {
        String text = str(value);
        if (text.isEmpty()) {
            return defaultValue;
        }
        try {
            return Long.parseLong(text);
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private String str(Object value) {
        return value == null ? "" : value.toString().trim();
    }
}
