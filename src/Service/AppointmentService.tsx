import axiosInstance from "./axiosInstance";

// ✅ Register (Schedule) Appointment
export const scheduleAppointment = async (data: any) => {
  const response = await axiosInstance.post("/appointments/schedule", data);
  return response.data;
};

// ✅ Cancel Appointment
export const cancelAppointment = async (id: string | number) => {
  const response = await axiosInstance.put(`/appointments/cancel/${id}`);
  return response.data;
};

// ✅ Get Appointments by user/patient id
export const getAppointments = async (id: string | number) => {
  const response = await axiosInstance.get(`/appointments/get/${id}`);
  return response.data;
};

// ✅ Get details of a specific appointment
export const getAppointmentDetails = async (id: string | number) => {
  const response = await axiosInstance.get(`/appointments/get/details/${id}`);
  return response.data;
};

export const getAppointmentByPatient = async (patientId: string | number) => {
  const response = await axiosInstance.get(`/appointments/getAllByPatient/${patientId}`);
  return response.data;
};

export const getAppointmentByDoctor = async (doctorId: string | number) => {
  const response = await axiosInstance.get(
    `/appointments/getAllByDoctor/${doctorId}`
  );
  return response.data;
};

