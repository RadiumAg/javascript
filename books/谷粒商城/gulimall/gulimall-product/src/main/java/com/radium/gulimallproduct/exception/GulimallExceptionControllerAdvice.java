package com.radium.gulimallproduct.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 集中处理所有异常
 **/
@Slf4j
//@ResponseBody
//@ControllerAdvice(basePackages = "com.radium.gulimall.proct.controller")
@RestControllerAdvice
public class GulimallExceptionControllerAdvice {

    @ExceptionHandler(value = Exception.class)
    public void handlerException(Exception e) {
    }
}
