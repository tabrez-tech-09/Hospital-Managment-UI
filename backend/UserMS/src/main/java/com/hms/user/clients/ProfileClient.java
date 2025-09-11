package com.hms.user.clients;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.hms.user.dto.UserDTO;



@FeignClient(name = "UserMS")
public interface ProfileClient {
    @PostMapping("/profile/doctors/add")
    Long addProfile(@RequestBody UserDTO userDTO);
    @PostMapping("/profile/patients/add")
    Long addPatientProfile(@RequestBody UserDTO userDTO);
}