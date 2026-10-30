package com.radium.gulimallgateway.config;

import jakarta.servlet.Filter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 网关统一负责 CORS。renren-fast 自己的 io.renren.config.CorsConfig 也会加一套
 * Access-Control-* 头，DefaultCorsProcessor 用的是 add 而非 set，所以真实请求上会出现两个
 * Access-Control-Allow-Origin，浏览器直接判定非法 —— 由路由上的 DedupeResponseHeader 收敛成一条。
 */
@Configuration
public class GulimallCorsConfig {

    @Bean
    public FilterRegistrationBean<Filter> gatewayCorsFilter() {
        CorsConfiguration cors = new CorsConfiguration();
        // allowCredentials=true 时不能用 addAllowedOrigin("*")，Spring 会抛 IllegalArgumentException
        cors.addAllowedOriginPattern("*");
        cors.addAllowedHeader("*");
        cors.addAllowedMethod("*");
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);

        // 必须是 servlet 版的 CorsFilter；reactive 的 CorsWebFilter 在 WebMVC 网关里不会被容器调用
        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>(new CorsFilter(source));
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        // 必须覆盖全部路径：Spring MVC 会在 DispatcherServlet 层自动应答 OPTIONS，
        // 预检若不走这里就会被网关自己吞掉（实测只回 Allow 头，没有 ACAO），且不会转发到后端
        registration.addUrlPatterns("/*");
        return registration;
    }
}
