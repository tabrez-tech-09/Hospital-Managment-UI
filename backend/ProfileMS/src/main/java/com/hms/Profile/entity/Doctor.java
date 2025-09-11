package com.hms.Profile.entity;

import java.time.LocalDate;

import com.hms.Profile.dto.DoctorDTO;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;  // <-- Important for JPA annotations
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity                     // ✅ Mark as JPA entity
//@Table(name = "doctors")    // ✅ Optional: map to "doctors" table
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

   /// @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dob;

    private String phone;
    private String address;

    @Column(unique = true)
    private String licenseNO;  
    private String specialization;
    private String department;
    private int totalExp;

    public DoctorDTO toDTO() {
        return new DoctorDTO(
                this.id,
                this.name,
                this.email,
                this.dob,
                this.phone,
                this.address,
                this.licenseNO,
                this.specialization,
                this.department,
                this.totalExp
        );
    }
}

