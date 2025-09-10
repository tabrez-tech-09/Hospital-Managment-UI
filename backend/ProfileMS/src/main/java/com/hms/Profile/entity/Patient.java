package com.hms.Profile.entity;

import java.time.LocalDate;

import com.hms.Profile.dto.BloodGroup;
import com.hms.Profile.dto.PatientDTO;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private LocalDate dob;
    private String phone;
    private String address;

    @Column(unique = true)
    private String adharNO;

    @Enumerated(EnumType.STRING)
    private BloodGroup bloodGroup;

    public PatientDTO toDTO() {
        return new PatientDTO(this.id, this.name, this.email, this.dob, this.phone,
                this.address, this.adharNO, this.bloodGroup);
    }
}

