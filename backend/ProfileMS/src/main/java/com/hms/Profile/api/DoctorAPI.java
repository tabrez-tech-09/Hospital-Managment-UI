package com.hms.Profile.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hms.Profile.dto.DoctorDTO;
import com.hms.Profile.exception.HmsException;
import com.hms.Profile.service.DoctorService;

@RestController
@CrossOrigin
@RequestMapping("/profile/doctors")
public class DoctorAPI {

    @Autowired
    private DoctorService doctorService;

    @PostMapping("/add")
    public ResponseEntity<?> addDoctor(@RequestBody DoctorDTO doctorDTO) {
        try {
            Long id = doctorService.addDoctor(doctorDTO);
            return ResponseEntity.ok(id);
        } catch (HmsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getDoctorById(@PathVariable Long id) {
        try {
            DoctorDTO doctorDTO = doctorService.getDoctorById(id);
            return ResponseEntity.ok(doctorDTO);
        } catch (HmsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody DoctorDTO doctorDTO) {
        try {
            DoctorDTO updatedDoctor = doctorService.updateDoctor(id, doctorDTO);
            return ResponseEntity.ok(updatedDoctor);
        } catch (HmsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/exists/{id}")
    public ResponseEntity<Boolean> doctorExists(@PathVariable Long id) {
        boolean exists = doctorService.doctorExists(id);
        return ResponseEntity.ok(exists);
    }
}