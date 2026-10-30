package com.radium.gulimall.common.config;

import com.radium.gulimall.common.exception.GulimallExceptionControllerAdvice;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@Import(GulimallExceptionControllerAdvice.class)
public class CommonAutoConfiguration {
}
