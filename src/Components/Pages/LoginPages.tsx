import React from "react";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Service/UserService";
import { useDispatch } from "react-redux";
import { setJwt } from "../../Slices/JwtSlice";
import { setUser } from "../../Slices/UserSlice";
import { jwtDecode } from "jwt-decode";
import {
  successNotification,
  unsuccessNotification,
} from "../../Util/NotificationUtil";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value: string) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      password: (value: string) =>
        value.length >= 6 ? null : "Password must be at least 6 characters long",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const userData = await loginUser(values); // ✅ direct user object
      console.log("✅ Login Success:", userData);

      if (!userData?.token) {
        throw new Error("No token received from backend!");
      }

      // ✅ Decode JWT if you want claims
      const decoded: any = jwtDecode(userData.token);
      console.log("Decoded JWT:", decoded);

      // ✅ Save JWT to Redux + localStorage
      dispatch(setJwt(userData.token));
      localStorage.setItem("token", userData.token);

      // ✅ Save user info to Redux
      dispatch(setUser(userData));

      // ✅ Success message + navigation
      successNotification("Login successful!");
      //navigate("/AdminDashBoard");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      unsuccessNotification(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url("/loginBgHos.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      className="h-screen w-screen flex flex-col items-center justify-center"
    >
      {/* Logo / Heading */}
      <div className="text-pink-400 flex gap-1 items-center py-3">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading font-semibold text-4xl">pulse</span>
      </div>

      {/* Form Card */}
      <div className="w-[450px] bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Login
          </div>

          <TextInput
            {...form.getInputProps("email")}
            placeholder="Email"
            size="md"
            radius="md"
            variant="filled"
            styles={{
              input: {
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              },
            }}
          />

          <PasswordInput
            {...form.getInputProps("password")}
            placeholder="Password"
            size="md"
            radius="md"
            variant="filled"
            styles={{
              input: {
                backgroundColor: "transparent",
                color: "white",
                border: "1px solid rgba(255,255,255,0.3)",
              },
            }}
          />

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            color="pink"
            className="font-semibold"
            disabled={!form.isValid()}
          >
            Login
          </Button>

          <div className="text-center text-neutral-100">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-400 hover:underline">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

















