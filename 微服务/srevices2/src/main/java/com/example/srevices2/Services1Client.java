package com.example.srevices2;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

@FeignClient(name = "srevices1", fallback = Services1ClientFallback.class)
public interface Services1Client {

	@GetMapping("/config")
	Map<String, Object> config();

}
