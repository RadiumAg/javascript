package com.radium.gulimall.common.exception;

public class GulimallException extends RuntimeException {

    private final int code;

    public GulimallException(int code, String message) {
        super(message);
        this.code = code;
    }

    public GulimallException(BizCodeEnume bizCodeEnume) {
        super(bizCodeEnume.getMsg());
        this.code = bizCodeEnume.getCode();
    }

    public int getCode() {
        return code;
    }
}
