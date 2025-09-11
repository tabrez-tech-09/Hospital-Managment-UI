import axiosInstance from "./axiosInstance";

// Doctor fetch by ID
export const getDoctor = async (id: number) => {
  const response = await axiosInstance.get(`/profile/doctors/get/${id}`);
  return response.data;
};

export const updateDoctorProfile = async (id: number, profileData: any) => {
  const response = await axiosInstance.put(`/profile/doctors/update/${id}`, profileData);
  return response.data;
};

