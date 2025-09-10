package com.hms.Profile.repository;

import java.util.Optional;
import org.springframework.data.repository.CrudRepository;
import com.hms.Profile.entity.Doctor;

public interface DoctorRepository extends CrudRepository<Doctor, Long> {

    // find doctor by email
    Optional<Doctor> findByEmail(String email);

    // find doctor by license number
    Optional<Doctor> findByLicenseNO(String licenseNO);
}


