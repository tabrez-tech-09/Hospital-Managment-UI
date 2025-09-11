import axiosInstance from "./axiosInstance";

// Patient fetch by ID
export const getPatient = async (id: number) => {
  const response = await axiosInstance.get(`/profile/patients/get/${id}`);
  return response.data;
};

export const updatePatientProfile = async (id: number, profileData: any) => {
  const response = await axiosInstance.put(`/profile/patients/update/${id}`, profileData);
  return response.data;
};