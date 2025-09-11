package com.hms.appointment.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Gateway + Frontend dono allow
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",  // React frontend
                "http://localhost:9000"   // Gateway
        ));

        // ✅ Methods allow
        config.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        // ✅ Headers allow
        config.addAllowedHeader("*");

        // ✅ Credentials allow (cookies / JWT)
        config.setAllowCredentials(true);

        // ✅ Expose headers (optional, agar JWT / custom header use kar rahe ho)
        config.addExposedHeader("Authorization");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}


