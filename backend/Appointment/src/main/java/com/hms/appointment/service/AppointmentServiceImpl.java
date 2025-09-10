package com.hms.appointment.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hms.appointment.clients.ProfileClient;
import com.hms.appointment.dto.AppointmentDTO;
import com.hms.appointment.dto.AppointmentDetails;
import com.hms.appointment.dto.DoctorDTO;
import com.hms.appointment.dto.PatientDTO;
import com.hms.appointment.dto.Status;
import com.hms.appointment.entity.Appointment;
import com.hms.appointment.exception.HmsException;
import com.hms.appointment.repository.AppointmentRepository;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ApiService apiService;

    @Autowired
    private ProfileClient profileClient;

    @Override
    public Long scheduleAppointment(AppointmentDTO appointmentDTO) throws HmsException {
        boolean doctorExists = profileClient.doctorExists(appointmentDTO.getDoctorId());
        if (!doctorExists) {
            throw new HmsException("Doctor not found", 404);
        }

        boolean patientExists = profileClient.patientExists(appointmentDTO.getPatientId());
        if (!patientExists) {
            throw new HmsException("Patient not found", 404);
        }

        appointmentDTO.setStatus(Status.SCHEDULED);
        return appointmentRepository.save(appointmentDTO.toEntity()).getId();
    }

    @Override
    public void cancelAppointment(Long appointmentId) throws HmsException {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("Appointment not found", 404));

        if (appointment.getStatus() == Status.CANCELLED) {
            throw new HmsException("Appointment is already cancelled", 400);
        }

        appointment.setStatus(Status.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public void completeAppointment(Long appointmentId) {
        // Future implementation
    }

    @Override
    public void rescheduleAppointment(Long appointmentId, String newDateTime) {
        // Future implementation
    }

    @Override
    public AppointmentDTO getAppointmentDetails(Long appointmentId) throws HmsException {
        return appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new HmsException("Appointment not found", 404))
                .toDTO();
    }



    @Override
public AppointmentDetails getAppointmentDetailsWithName(Long appointmentId) throws HmsException {
    AppointmentDTO appointmentDTO = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new HmsException("Appointment not found", 404))
            .toDTO();

    DoctorDTO doctorDTO = profileClient.getDoctorById(appointmentDTO.getDoctorId());
    PatientDTO patientDTO = profileClient.getPatientById(appointmentDTO.getPatientId());

    if (doctorDTO == null) {
        throw new HmsException("Doctor details not found", 404);
    }
    if (patientDTO == null) {
        throw new HmsException("Patient details not found", 404);
    }

    AppointmentDetails appointmentDetails = new AppointmentDetails();
    appointmentDetails.setId(appointmentDTO.getId());
    appointmentDetails.setPatientId(appointmentDTO.getPatientId());
    appointmentDetails.setPatientName(patientDTO.getName());
    appointmentDetails.setPatientEmail(patientDTO.getEmail());
    appointmentDetails.setPatientPhone(patientDTO.getPhone());
    appointmentDetails.setDoctorId(appointmentDTO.getDoctorId());
    appointmentDetails.setDoctorName(doctorDTO.getName());
    appointmentDetails.setAppointmentTime(appointmentDTO.getAppointmentTime());
    appointmentDetails.setStatus(appointmentDTO.getStatus());
    appointmentDetails.setReason(appointmentDTO.getReason());
    appointmentDetails.setNotes(appointmentDTO.getNotes());

    return appointmentDetails;
    }
}
