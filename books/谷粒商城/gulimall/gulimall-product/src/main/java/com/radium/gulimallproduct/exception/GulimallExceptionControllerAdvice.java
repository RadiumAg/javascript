package com.radium.gulimallproduct.exception;

import com.radium.gulimall.common.exception.BizCodeEnume;
import com.radium.gulimall.common.utils.R;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.beans.Expression;
import java.util.HashMap;

/**
 * 集中处理所有异常
 **/
@Slf4j
//@ResponseBody
//@ControllerAdvice(basePackages = "com.radium.gulimall.proct.controller")
@RestControllerAdvice
public class GulimallExceptionControllerAdvice {

    @ExceptionHandler(value = MethodArgumentNotValidException.class)
    public R handlerException(MethodArgumentNotValidException e) {
        var bindingResult = e.getBindingResult();
        var fieldErrors = bindingResult.getFieldErrors();

        var errorMap = new HashMap<String, String>();
        bindingResult.getFieldErrors().forEach((fieldError) -> {
            errorMap.put(fieldError.getField(), fieldError.getDefaultMessage());
        });

        return R.error(BizCodeEnume.VALID_EXCEPTION.getCode(), BizCodeEnume.VALID_EXCEPTION.getMsg()).put("data", errorMap);
    }

    @ExceptionHandler(value = Throwable.class)
    public R handlerException(Throwable e) {
        return R.error(BizCodeEnume.UNKNOW_EXCEPTION.getCode(), BizCodeEnume.UNKNOW_EXCEPTION.getMsg());
    }
}
