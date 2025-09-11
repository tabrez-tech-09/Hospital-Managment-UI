package com.hms.appointment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import com.hms.appointment.dto.PatientDTO;
import com.hms.appointment.dto.DoctorDTO;

@Service
public class ApiService {

    @Autowired
    private WebClient.Builder webClient;

    public Mono<Boolean> doctorExists(Long id) {
        return webClient.build()
                .get()
                .uri("http://localhost:9100/profile/doctors/exists/{id}", id)
                .retrieve()
                .bodyToMono(Boolean.class);
    }

    public Mono<Boolean> patientExists(Long id) {
        return webClient.build()
                .get()
                .uri("http://localhost:9100/profile/patients/exists/{id}", id)
                .retrieve()
                .bodyToMono(Boolean.class);
    }

    public Mono<PatientDTO> getPatientById(Long id) {
        return webClient.build()
                .get()
                .uri("http://localhost:9100/profile/patients/get/{id}", id)
                .retrieve()
                .bodyToMono(PatientDTO.class);
    }

    public Mono<DoctorDTO> getDoctorById(Long id) {
        return webClient.build()
                .get()
                .uri("http://localhost:9100/profile/doctors/get/{id}", id)
                .retrieve()
                .bodyToMono(DoctorDTO.class);
    }
}

