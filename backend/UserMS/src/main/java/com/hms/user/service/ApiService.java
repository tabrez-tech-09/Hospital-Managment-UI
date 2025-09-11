package com.hms.user.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.hms.user.dto.Roles;
import com.hms.user.dto.UserDTO;

@Service
public class ApiService {

    @Autowired
    private WebClient.Builder webClient;

    public Long addProfile(UserDTO userDTO) {
        if (userDTO.getRole().equals(Roles.DOCTOR)) {
            return webClient.build().post()
                    .uri("http://localhost:9100/profile/doctors/add")
                    .bodyValue(userDTO)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block(); // ✅ return Long
        } else if (userDTO.getRole().equals(Roles.PATIENT)) {
            return webClient.build().post()
                    .uri("http://localhost:9100/profile/patients/add")
                    .bodyValue(userDTO)
                    .retrieve()
                    .bodyToMono(Long.class)
                    .block();
        }
        return null;
    }
}
