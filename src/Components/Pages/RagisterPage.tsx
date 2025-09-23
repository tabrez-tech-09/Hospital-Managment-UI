import {
  TextInput,
  PasswordInput,
  Button,
  SegmentedControl,
} from "@mantine/core";
import { IconHeartbeat } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../Service/UserService";
import {
  successNotification,
  unsuccessNotification,
} from "../../Util/NotificationUtil";

interface RegisterFormValues {
  name: string;
  role: "PATIENT" | "DOCTOR" | "ADMIN"; // ✅ changed from type → role
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    initialValues: {
      name: "",
      role: "PATIENT", // ✅ updated
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => (value.trim() ? null : "Name is required"),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email format",
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, ...userData } = values; // ✅ confirmPassword excluded
      const data = await registerUser(userData);
      console.log("✅ Registered:", data);

      successNotification("Success", data.message || "Account created successfully");
      navigate("/login");
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      unsuccessNotification(
        "Error",
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url("/loginBgHos.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-pink-400 flex gap-1 items-center py-3">
        <IconHeartbeat size={45} stroke={2.5} />
        <span className="font-heading font-semibold text-4xl">pulse</span>
      </div>

      <div className="w-[450px] bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20">
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          <div className="self-center font-medium font-heading text-white text-xl">
            Register
          </div>

          <SegmentedControl
            value={form.values.role} // ✅ updated
            onChange={(value) =>
              form.setFieldValue("role", value as "PATIENT" | "DOCTOR" | "ADMIN")
            }
            fullWidth
            size="md"
            radius="md"
            color="pink"
            data={[
              { label: "Patient", value: "PATIENT" },
              { label: "Doctor", value: "DOCTOR" },
              { label: "Admin", value: "ADMIN" },
            ]}
          />

          <TextInput
            {...form.getInputProps("name")}
            placeholder="Full Name"
            size="md"
            radius="md"
            variant="filled"
          />
          <TextInput
            {...form.getInputProps("email")}
            placeholder="Email"
            size="md"
            radius="md"
            variant="filled"
          />
          <PasswordInput
            {...form.getInputProps("password")}
            placeholder="Password"
            size="md"
            radius="md"
            variant="filled"
          />
          <PasswordInput
            {...form.getInputProps("confirmPassword")}
            placeholder="Confirm Password"
            size="md"
            radius="md"
            variant="filled"
          />

          <Button
            type="submit"
            size="md"
            radius="md"
            fullWidth
            color="pink"
            className="font-semibold"
          >
            Register
          </Button>

          <div className="text-center text-neutral-200">
            Already have an account?{" "}
            <Link to="/login" className="text-pink-400 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;












