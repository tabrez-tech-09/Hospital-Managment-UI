package com.hms.Profile.dto;

import java.time.LocalDate;

import com.hms.Profile.entity.Doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDTO {
    private Long id;
    private String name;
    private String email;
    private LocalDate dob;
    private String phone;
    private String address;
    private String licenseNO;
    public String specialization;
    public String department;
    public int totalExp;

    public Doctor toEntity(){
    return  new Doctor(this.id , this.name , this.email, this.dob, this.phone, this.address , this.licenseNO, this.specialization, this.department, this.totalExp);
    }
}