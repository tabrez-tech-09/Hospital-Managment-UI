package com.hms.Profile.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.Profile.dto.PatientDTO;
import com.hms.Profile.exception.HmsException;
import com.hms.Profile.service.PatientService;

@RestController
@CrossOrigin
@RequestMapping("/profile/patients")
public class PatientAPI {

    @Autowired
    private PatientService patientService;

    @PostMapping("/add")
    public ResponseEntity<?> addPatient(@RequestBody PatientDTO patientDTO) {
        try {
            Long id = patientService.addPatient(patientDTO);
            return ResponseEntity.ok(id);
        } catch (HmsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getPatientById(@PathVariable Long id) {
        try {
            PatientDTO patientDTO = patientService.getPatientById(id);
            return ResponseEntity.ok(patientDTO);
        } catch (HmsException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
   @PutMapping("/update/{id}")
public ResponseEntity<?> updatePatient(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
    try {
        PatientDTO updatedPatient = patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok(updatedPatient);
    } catch (HmsException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
@GetMapping("/exists/{id}")
public ResponseEntity<Boolean> patientExists(@PathVariable Long id) {
    boolean exists = patientService.patientExists(id);
    return ResponseEntity.ok(exists);
}
}