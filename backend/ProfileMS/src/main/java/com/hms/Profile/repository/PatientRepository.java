package com.hms.Profile.repository;

import org.springframework.data.repository.CrudRepository;
import com.hms.Profile.entity.Patient;
import java.util.Optional;

public interface PatientRepository extends CrudRepository<Patient, Long> {

    Optional<Patient> findByEmail(String email);

    Optional<Patient> findByAdharNO(String adharNO);
}

