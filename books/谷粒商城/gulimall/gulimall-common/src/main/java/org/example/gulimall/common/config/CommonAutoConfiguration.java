package org.example.gulimall.common.config;

import org.example.gulimall.common.exception.GulimallExceptionControllerAdvice;
import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Import;

@AutoConfiguration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
@Import(GulimallExceptionControllerAdvice.class)
public class CommonAutoConfiguration {
}
