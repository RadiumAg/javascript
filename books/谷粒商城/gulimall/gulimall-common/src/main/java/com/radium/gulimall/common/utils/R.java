package com.radium.gulimall.common.utils;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

public class R<T> extends HashMap<String, Object> implements Serializable {

    private static final long serialVersionUID = 1L;

    /** data 的键名，序列化后仍是 map 里的一个 entry，保持线上格式不变 */
    private static final String DATA_KEY = "data";

    public R() {
        put("code", 0);
        put("msg", "success");
    }

    public static <T> R<T> ok() {
        return new R<>();
    }

    public static <T> R<T> ok(String msg) {
        R<T> r = new R<>();
        r.put("msg", msg);
        return r;
    }

    public static <T> R<T> ok(Map<String, Object> map) {
        R<T> r = new R<>();
        r.putAll(map);
        return r;
    }

    public static <T> R<T> error() {
        return error(500, "未知异常，请联系管理员");
    }

    public static <T> R<T> error(String msg) {
        return error(500, msg);
    }

    public static <T> R<T> error(int code, String msg) {
        R<T> r = new R<>();
        r.put("code", code);
        r.put("msg", msg);
        return r;
    }

    /**
     * 只能写进 map，不能存成实例字段：Jackson 把 Map 子类按 Map 序列化，
     * 普通字段不会出现在 JSON 里，前端会拿到没有 data 的响应。
     */
    @SuppressWarnings("unchecked")
    public R<T> setData(T data) {
        super.put(DATA_KEY, data);
        return this;
    }

    @SuppressWarnings("unchecked")
    public T getData() {
        return (T) get(DATA_KEY);
    }

    @Override
    public R<T> put(String key, Object value) {
        super.put(key, value);
        return this;
    }
}
