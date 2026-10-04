package com.example.srevices2;

import com.alibaba.cloud.sentinel.annotation.SentinelRestTemplate;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

	@Bean
	@LoadBalanced
	@SentinelRestTemplate(blockHandler = "blockHandler", blockHandlerClass = SentinelRestFallback.class,
			fallback = "fallback", fallbackClass = SentinelRestFallback.class)
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}

}
