import axiosInstance from "./axiosInstance";

// ✅ Register API
export const registerUser = async (userData: any) => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

// ✅ Login API
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await axiosInstance.post("/users/login", credentials);

  // backend response structure: {status, message, data: {...user + token...}}
  const userData = response.data?.data;

  if (userData?.token) {
    localStorage.setItem("token", userData.token);
  } else {
    console.error("No token received from backend!");
  }

  return userData; // ✅ only user object return (not whole response)
};




