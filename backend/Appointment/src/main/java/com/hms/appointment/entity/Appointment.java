package com.hms.appointment.entity;
import com.hms.appointment.dto.AppointmentDTO;
import com.hms.appointment.dto.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;




@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String appointmentTime;
    private Status status;
    private String reason;
    private String notes;

    public AppointmentDTO toDTO() {
        return new AppointmentDTO(id, patientId, doctorId, appointmentTime, status,  reason , notes);
    }
}
