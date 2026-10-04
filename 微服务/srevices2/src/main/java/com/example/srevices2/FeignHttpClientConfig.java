package com.example.srevices2;

import org.apache.hc.client5.http.impl.DefaultHttpRequestRetryStrategy;
import org.apache.hc.core5.util.TimeValue;

import org.springframework.cloud.openfeign.clientconfig.HttpClient5FeignConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignHttpClientConfig {

	// HttpClient 5 默认对 429/503 自动重试一次并等 1 秒，会把下游的限流吃掉，
	// 表现为调用耗时 1 秒但最终成功，Feign 的 fallback 永远不触发
	@Bean
	public HttpClient5FeignConfiguration.HttpClientBuilderCustomizer disableFeignHttpRetry() {
		return builder -> builder
			.setRetryStrategy(new DefaultHttpRequestRetryStrategy(0, TimeValue.ZERO_MILLISECONDS));
	}

}
