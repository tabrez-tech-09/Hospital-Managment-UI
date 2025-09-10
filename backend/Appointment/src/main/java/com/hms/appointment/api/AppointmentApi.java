package com.hms.appointment.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.appointment.dto.AppointmentDTO;
import com.hms.appointment.dto.AppointmentDetails;
import com.hms.appointment.exception.HmsException;
import com.hms.appointment.service.AppointmentService;

@RestController
@CrossOrigin
@RequestMapping("/appointments")
@Validated
public class AppointmentApi {
    @Autowired
    private AppointmentService appointmentService;

      @PostMapping("/schedule")
    public ResponseEntity<Long> scheduleAppointment(@RequestBody AppointmentDTO appointmentDTO) throws HmsException {
        Long appointmentId = appointmentService.scheduleAppointment(appointmentDTO);
        return ResponseEntity.ok(appointmentId);
    }

    @PutMapping("/cancel/{appointmentId}")
    public ResponseEntity<String> cancelAppointment(@PathVariable Long appointmentId) throws HmsException{
        appointmentService.cancelAppointment(appointmentId);
        return new ResponseEntity<>("Appointment canceled successfully", HttpStatus.OK);
    }
    @GetMapping("/get/{appointmentId}")
    public ResponseEntity<AppointmentDTO> getAppointmentDetails(@PathVariable Long appointmentId) throws HmsException{
        return new ResponseEntity<>(appointmentService.getAppointmentDetails(appointmentId) , HttpStatus.OK);
    }

    @GetMapping("/get/details/{appointmentId}")
    public ResponseEntity<AppointmentDetails> getAppointmentDetailsWithName(@PathVariable Long appointmentId) throws HmsException{
        return new ResponseEntity<>(appointmentService.getAppointmentDetailsWithName(appointmentId) , HttpStatus.OK);
    }
}
