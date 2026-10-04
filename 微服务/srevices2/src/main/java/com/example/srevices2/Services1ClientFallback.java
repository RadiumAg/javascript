package com.example.srevices2;

import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class Services1ClientFallback implements Services1Client {

	@Override
	public Map<String, Object> config() {
		return Map.of("fallback", true, "source", "Services1ClientFallback", "greeting",
				"srevices1 被限流或不可用，这是 Feign 兜底数据", "timeout", -1, "featureEnabled", false);
	}

}
