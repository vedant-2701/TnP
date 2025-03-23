package com.tnp.tnpbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class TnpbackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TnpbackendApplication.class, args);
	}

}
