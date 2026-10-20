package org.example.gulimall.common.exception;

import lombok.extern.slf4j.Slf4j;
import org.example.gulimall.common.utils.R;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GulimallExceptionControllerAdvice {

    @ExceptionHandler(BindException.class)
    public R handleValidException(BindException e) {
        Map<String, String> data = new HashMap<>();
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            data.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        log.error("数据校验出现问题：{}，异常类型：{}", e.getMessage(), e.getClass());
        return R.error(BizCodeEnume.VALID_EXCEPTION.getCode(), BizCodeEnume.VALID_EXCEPTION.getMsg())
                .put("data", data);
    }

    @ExceptionHandler(GulimallException.class)
    public R handleGulimallException(GulimallException e) {
        log.error("业务异常：{}", e.getMessage(), e);
        return R.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Throwable.class)
    public R handleThrowable(Throwable e) {
        log.error("系统未知异常", e);
        return R.error(BizCodeEnume.UNKNOW_EXCEPTION.getCode(), BizCodeEnume.UNKNOW_EXCEPTION.getMsg());
    }
}
