import "@mantine/core/styles.css";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Avatar, Card, Grid, Text, Paper, Title, Group, Stack,
  TextInput, Button, Select, Container, NumberInput
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { getDoctor, updateDoctorProfile } from "../../../Service/DoctorProfileService";
import { notifications } from "@mantine/notifications";

// Default data
const defaultDoctorData = {
  name: "---",
  email: "----",
  dob: new Date("------"),
  phone: "-----",
  address: "------",
  licenseNO: "------",
  specialization: "------",
  department: "------",
  totalExp: 0,
  avatar: "/tabrez_logo.jpg",
};

const departments = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "Pediatrics"];
const specializations = ["Cardiologist", "Neurologist", "Orthopedic", "Dermatologist", "Pediatrician"];

const DoctorProfile = () => {
  const user = useSelector((state: any) => state.user) || {};

  const [editableInfo, setEditableInfo] = useState({
    dob: user.dob ? new Date(user.dob) : defaultDoctorData.dob,
    phone: user.phone || defaultDoctorData.phone,
    address: user.address || defaultDoctorData.address,
    licenseNO: user.licenseNO || defaultDoctorData.licenseNO,
    specialization: user.specialization || defaultDoctorData.specialization,
    department: user.department || defaultDoctorData.department,
    totalExp: user.totalExp || defaultDoctorData.totalExp,
  });

  const [avatar, setAvatar] = useState<string>(
    user.avatar || defaultDoctorData.avatar
  );
  const [isEditing, setIsEditing] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: string, value: any) => {
    setEditableInfo({ ...editableInfo, [key]: value });
  };

  useEffect(() => {
    if (user.profileId) {
      getDoctor(user.profileId)
        .then((data) => {
          console.log("Fetched doctor profile:", data);
          setEditableInfo({
            dob: data.dob ? new Date(data.dob) : defaultDoctorData.dob,
            phone: data.phone || defaultDoctorData.phone,
            address: data.address || defaultDoctorData.address,
            licenseNO: data.licenseNO || defaultDoctorData.licenseNO,
            specialization: data.specialization || defaultDoctorData.specialization,
            department: data.department || defaultDoctorData.department,
            totalExp: data.totalExp || defaultDoctorData.totalExp,
          });
          setAvatar(data.avatar || defaultDoctorData.avatar);
        })
        .catch((error) => {
          console.error("Error fetching doctor profile:", error);
        });
    }
  }, [user.profileId]);

  const handleSave = async () => {
    try {
      const payload = { ...editableInfo, avatar };
      console.log("Saving doctor info:", payload);

      const updated = await updateDoctorProfile(user.profileId, payload);
      console.log("✅ Updated on backend:", updated);

      setIsEditing(false);
      notifications.show({
        title: "Profile Updated",
        message: "Doctor profile updated successfully!",
        color: "green",
      });
    } catch (err) {
      console.error("❌ Failed to update:", err);
      notifications.show({
        title: "Update Failed",
        message: "Something went wrong while updating the profile.",
        color: "red",
      });
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container fluid style={{ minHeight: "100vh", padding: "2rem" }}>
      <Paper shadow="lg" radius="xl" style={{ padding: "2rem", backgroundColor: "#f9f9f9" }}>
        {/* Header */}
        <Group align="center" justify="flex-start" mb="xl">
          <div style={{ position: "relative", cursor: isEditing ? "pointer" : "default" }}>
            <Avatar src={avatar} size={120} radius="xl" onClick={handleAvatarClick} />
            {isEditing && (
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#4caf50",
                  borderRadius: "50%",
                  padding: "5px",
                  color: "white",
                  fontSize: "14px",
                }}
              >
                ✎
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <Stack gap="xs" style={{ marginLeft: "1rem" }}>
            <Title order={2}>{user.name || defaultDoctorData.name}</Title>
            <Text color="dimmed" size="lg">
              {user.email || defaultDoctorData.email}
            </Text>
          </Stack>
        </Group>

        {/* Edit / Save Button */}
        <Group align="center" justify="flex-end" mb="md">
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <Button size="sm" color="green" onClick={handleSave}>
              Save
            </Button>
          )}
        </Group>

        {/* Form */}
        <Grid gutter="md">
          {/* DOB */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Date of Birth</Text>
              {isEditing ? (
                <DatePicker
                  value={editableInfo.dob instanceof Date ? editableInfo.dob : new Date(editableInfo.dob)}
                  onChange={(date) => handleChange("dob", date)}
                  maxDate={new Date()}
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">
                  {editableInfo.dob
                    ? (editableInfo.dob instanceof Date
                        ? editableInfo.dob
                        : new Date(editableInfo.dob)
                      ).toLocaleDateString("en-IN")
                    : "N/A"}
                </Text>
              )}
            </Card>
          </Grid.Col>

          {/* Phone */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Phone</Text>
              {isEditing ? (
                <TextInput
                  value={editableInfo.phone}
                  onChange={(e) => {
                    const val = e.currentTarget.value.replace(/\D/g, "");
                    if (val.length <= 10) handleChange("phone", val);
                  }}
                  placeholder="Enter 10-digit phone"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.phone}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* Address */}
          <Grid.Col span={12}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Address</Text>
              {isEditing ? (
                <TextInput
                  value={editableInfo.address}
                  onChange={(e) => handleChange("address", e.currentTarget.value)}
                  placeholder="Enter address"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.address}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* License Number */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">License Number</Text>
              {isEditing ? (
                <TextInput
                  value={editableInfo.licenseNO}
                  onChange={(e) => handleChange("licenseNO", e.currentTarget.value)}
                  placeholder="Enter license number"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.licenseNO}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* Specialization */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Specialization</Text>
              {isEditing ? (
                <Select
                  data={specializations}
                  value={editableInfo.specialization}
                  onChange={(value) => handleChange("specialization", value)}
                  placeholder="Select specialization"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.specialization}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* Department */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Department</Text>
              {isEditing ? (
                <Select
                  data={departments}
                  value={editableInfo.department}
                  onChange={(value) => handleChange("department", value)}
                  placeholder="Select department"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.department}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* Experience */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Total Experience (Years)</Text>
              {isEditing ? (
                <NumberInput
                  value={editableInfo.totalExp}
                  onChange={(val) => handleChange("totalExp", val)}
                  min={0}
                  max={60}
                  placeholder="Enter years of experience"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.totalExp} years</Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DoctorProfile;

