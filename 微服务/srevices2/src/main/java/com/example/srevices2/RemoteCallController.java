package com.example.srevices2;

import java.util.Map;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
public class RemoteCallController {

	private static final String SERVICES1_CONFIG = "http://srevices1/config";

	private final Services1Client services1Client;

	private final RestTemplate restTemplate;

	public RemoteCallController(Services1Client services1Client, RestTemplate restTemplate) {
		this.services1Client = services1Client;
		this.restTemplate = restTemplate;
	}

	@GetMapping("/call/feign")
	public Map<String, Object> byFeign() {
		return services1Client.config();
	}

	@GetMapping("/call/rest")
	public Map<String, Object> byRestTemplate() {
		return restTemplate.exchange(SERVICES1_CONFIG, HttpMethod.GET, null,
				new ParameterizedTypeReference<Map<String, Object>>() {
				}).getBody();
	}

}
