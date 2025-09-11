package com.hms.Profile.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.Profile.dto.DoctorDTO;
import com.hms.Profile.entity.Doctor;
import com.hms.Profile.exception.HmsException;
import com.hms.Profile.repository.DoctorRepository;

@Service
public class DoctorServiceImpl implements DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Override
    public Long addDoctor(DoctorDTO doctorDTO) throws HmsException {
        if (doctorDTO.getEmail() != null && doctorRepository.findByEmail(doctorDTO.getEmail()).isPresent()) {
            throw new HmsException("Doctor with this email already exists");
        }

        if (doctorDTO.getLicenseNO() != null && doctorRepository.findByLicenseNO(doctorDTO.getLicenseNO()).isPresent()) {
            throw new HmsException("Doctor with this license number already exists");
        }

        return doctorRepository.save(doctorDTO.toEntity()).getId();
    }

    @Override
    public DoctorDTO getDoctorById(Long id) throws HmsException {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new HmsException("Doctor not found"));
        return doctor.toDTO();
    }

    @Override
    public DoctorDTO updateDoctor(Long id, DoctorDTO doctorDTO) throws HmsException {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new HmsException("Doctor not found"));

        if (doctorDTO.getName() != null) doctor.setName(doctorDTO.getName());
        if (doctorDTO.getEmail() != null) doctor.setEmail(doctorDTO.getEmail());
        if (doctorDTO.getPhone() != null) doctor.setPhone(doctorDTO.getPhone());
        if (doctorDTO.getSpecialization() != null) doctor.setSpecialization(doctorDTO.getSpecialization());
        if (doctorDTO.getLicenseNO() != null) doctor.setLicenseNO(doctorDTO.getLicenseNO());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return updatedDoctor.toDTO();
    }

    @Override
    public boolean doctorExists(Long id) {
        return doctorRepository.existsById(id);
    }
}
