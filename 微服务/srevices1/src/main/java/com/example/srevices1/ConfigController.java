package com.example.srevices1;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class ConfigController {

	@Value("${demo.greeting}")
	private String greeting;

	@Value("${demo.timeout}")
	private int timeout;

	@Value("${demo.feature-enabled}")
	private boolean featureEnabled;

	@GetMapping("/config")
	public Map<String, Object> config() {
		return Map.of("greeting", greeting, "timeout", timeout, "featureEnabled", featureEnabled);
	}

}
