import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "../Components/LayOut/AdminDashBoard";
import LoginPage from "../Components/Pages/LoginPages";
import RegisterPage from "../Components/Pages/RagisterPage";
import PublicRoute from "./PublicRoutes";
import ProtectedRoute from "./ProtectedRoute"; 
import Random from "../Components/SideBar/Random";
import PatientsDashBoard from "../Components/LayOut/PatientsDashBoard";
import PatientsProfilePage from "../Components/Pages/Patients/PatientsProfilePage";
import DoctorDashBoard from "../Components/LayOut/DoctorDashBoard";
import DoctorProfilePage from "../Components/Pages/Doctor/DoctorProfilePage";
import PatientAppointment from "../Components/Pages/Patients/PatientAppointment";
import DoctorAppointment from "../Components/Pages/Doctor/DoctorAppointment";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Random />} />
          <Route path="pharmacy" element={<Random />} />
          <Route path="patients" element={<Random />} />
          <Route path="doctors" element={<Random />} />
        </Route>
         <Route
          path="/Patient"
          element={
            <ProtectedRoute>
              <PatientsDashBoard />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Random />} />
          <Route path="Profile" element={<PatientsProfilePage />} />
          <Route path="appointments" element={<PatientAppointment />} />
          <Route path="book" element={<Random />} />
          <Route path="doctors" element={<Random />} />
        </Route>

            <Route
          path="/doctor"
          element={
            <ProtectedRoute>
              <DoctorDashBoard/>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Random />} />
          <Route path="Profile" element={<DoctorProfilePage />} />
          <Route path="appointments" element={<DoctorAppointment />} />
          <Route path="book" element={<Random />} />
          <Route path="doctors" element={<Random />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;



