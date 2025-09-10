package com.hms.Profile.service;

import com.hms.Profile.dto.PatientDTO;
import com.hms.Profile.exception.HmsException;

public interface PatientService {

    Long addPatient(PatientDTO patientDTO) throws HmsException;

    PatientDTO getPatientById(Long id) throws HmsException;

    PatientDTO updatePatient(Long id, PatientDTO patientDTO) throws HmsException;

    boolean patientExists(Long id); // removed throws HmsException
}


