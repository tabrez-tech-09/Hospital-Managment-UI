package com.hms.Profile.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.Profile.dto.PatientDTO;
import com.hms.Profile.entity.Patient;
import com.hms.Profile.exception.HmsException;
import com.hms.Profile.repository.PatientRepository;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public Long addPatient(PatientDTO patientDTO) throws HmsException {
        if (patientDTO.getEmail() != null && patientRepository.findByEmail(patientDTO.getEmail()).isPresent()) {
            throw new HmsException("Patient with this email already exists");
        }

        if (patientDTO.getAdharNO() != null && patientRepository.findByAdharNO(patientDTO.getAdharNO()).isPresent()) {
            throw new HmsException("Patient with this Aadhar already exists");
        }

        Patient savedPatient = patientRepository.save(patientDTO.toEntity());
        return savedPatient.getId();
    }

    @Override
    public PatientDTO getPatientById(Long id) throws HmsException {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new HmsException("Patient not found"));
        return patient.toDTO();
    }

    @Override
    public PatientDTO updatePatient(Long id, PatientDTO patientDTO) throws HmsException {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new HmsException("Patient not found"));

        if (patientDTO.getName() != null) patient.setName(patientDTO.getName());
        if (patientDTO.getEmail() != null) patient.setEmail(patientDTO.getEmail());
        if (patientDTO.getPhone() != null) patient.setPhone(patientDTO.getPhone());
        if (patientDTO.getAddress() != null) patient.setAddress(patientDTO.getAddress());
        if (patientDTO.getAdharNO() != null) patient.setAdharNO(patientDTO.getAdharNO());
        if (patientDTO.getDob() != null) patient.setDob(patientDTO.getDob());

        Patient updatedPatient = patientRepository.save(patient);
        return updatedPatient.toDTO();
    }

    @Override
    public boolean patientExists(Long id) {
        return patientRepository.existsById(id);
    }
}



