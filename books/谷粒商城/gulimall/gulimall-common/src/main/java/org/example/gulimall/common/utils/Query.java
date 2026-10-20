package org.example.gulimall.common.utils;

import java.util.LinkedHashMap;
import java.util.Map;

public class Query extends LinkedHashMap<String, Object> {

    private static final long serialVersionUID = 1L;

    private static final int DEFAULT_PAGE = 1;
    private static final int DEFAULT_LIMIT = 10;

    public Query(Map<String, Object> params) {
        super(params);

        int page = parseInt(params.get("page"), DEFAULT_PAGE);
        int limit = parseInt(params.get("limit"), DEFAULT_LIMIT);

        put("page", page);
        put("limit", limit);
        put("offset", (page - 1) * limit);

        Object sidx = params.get("sidx");
        Object order = params.get("order");
        if (hasText(sidx) && hasText(order)) {
            put("sidx", sidx);
            put("order", order);
        }
    }

    private int parseInt(Object value, int defaultValue) {
        if (!hasText(value)) {
            return defaultValue;
        }
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private boolean hasText(Object value) {
        return value != null && !value.toString().isBlank();
    }
}
