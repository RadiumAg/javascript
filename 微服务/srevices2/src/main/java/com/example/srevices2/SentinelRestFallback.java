package com.example.srevices2;

import com.alibaba.cloud.sentinel.rest.SentinelClientHttpResponse;
import com.alibaba.csp.sentinel.slots.block.BlockException;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpResponse;

public final class SentinelRestFallback {

	private SentinelRestFallback() {
	}

	public static ClientHttpResponse blockHandler(HttpRequest request, byte[] body,
			ClientHttpRequestExecution execution, BlockException exception) {
		return new SentinelClientHttpResponse(
				"{\"fallback\":true,\"source\":\"rest-blockHandler\",\"reason\":\"被 Sentinel 限流\"}");
	}

	public static ClientHttpResponse fallback(HttpRequest request, byte[] body,
			ClientHttpRequestExecution execution, BlockException exception) {
		return new SentinelClientHttpResponse(
				"{\"fallback\":true,\"source\":\"rest-fallback\",\"reason\":\"调用 srevices1 失败\"}");
	}

}
