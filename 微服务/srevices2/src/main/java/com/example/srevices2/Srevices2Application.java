package com.example.srevices2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class Srevices2Application {

	public static void main(String[] args) {
		SpringApplication.run(Srevices2Application.class, args);
	}

}
