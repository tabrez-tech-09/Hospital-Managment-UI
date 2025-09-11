import "@mantine/core/styles.css";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Card,
  Grid,
  Text,
  Paper,
  Title,
  Group,
  Stack,
  TextInput,
  Button,
  Select,
  Container,
  Loader,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { getPatient, updatePatientProfile } from "../../../Service/PatientProfileService.";
import { notifications } from "@mantine/notifications";

// Default data
const defaultPatientData = {
  name: "---",
  email: "---",
  dob: new Date("1990-01-01"),
  phone: "-----",
  address: "-----",
  adharNO: "-----",
  bloodGroup: "-----",
  avatar: "/tabrez_logo.jpg",
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PatientProfile = () => {
  const user = useSelector((state: any) => state.user) || {};

  const [editableInfo, setEditableInfo] = useState({
    name: user.name || defaultPatientData.name,
    email: user.email || defaultPatientData.email,
    dob: user.dob ? new Date(user.dob) : defaultPatientData.dob,
    phone: user.phone || defaultPatientData.phone,
    address: user.address || defaultPatientData.address,
    adharNO: user.adharNO || defaultPatientData.adharNO,
    bloodGroup: user.bloodGroup || defaultPatientData.bloodGroup,
  });

  const [initialInfo, setInitialInfo] = useState(editableInfo); // keep backup
  const [avatar, setAvatar] = useState<string>(
    user.avatar || defaultPatientData.avatar
  );
  const [initialAvatar, setInitialAvatar] = useState(avatar); // backup avatar
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (key: string, value: any) => {
    setEditableInfo({ ...editableInfo, [key]: value });
  };

  useEffect(() => {
    if (user.profileId) {
      getPatient(user.profileId)
        .then((data) => {
          const patientData = {
            name: data.name || defaultPatientData.name,
            email: data.email || defaultPatientData.email,
            dob: data.dob ? new Date(data.dob) : defaultPatientData.dob,
            phone: data.phone || defaultPatientData.phone,
            address: data.address || defaultPatientData.address,
            adharNO: data.adharNO || defaultPatientData.adharNO,
            bloodGroup: data.bloodGroup || defaultPatientData.bloodGroup,
          };
          setEditableInfo(patientData);
          setInitialInfo(patientData);
          setAvatar(data.avatar || defaultPatientData.avatar);
          setInitialAvatar(data.avatar || defaultPatientData.avatar);
        })
        .catch((error) => {
          console.error("Error fetching patient profile:", error);
        });
    }
  }, [user.profileId]);

  const handleSave = async () => {
    try {
      setLoading(true);

      // Format dob for backend (YYYY-MM-DD) and remove avatar
      const payload = {
        name: editableInfo.name,
        email: editableInfo.email,
        phone: editableInfo.phone,
        address: editableInfo.address,
        adharNO: editableInfo.adharNO,
        bloodGroup: editableInfo.bloodGroup,
        dob: editableInfo.dob
          ? new Date(editableInfo.dob).toISOString().split("T")[0]
          : null,
      };

      console.log("📤 Saving patient info:", payload);

      const updated = await updatePatientProfile(user.profileId, payload);

      setIsEditing(false);
      setInitialInfo(updated);
      setInitialAvatar(avatar);

      notifications.show({
        title: "✅ Profile Updated",
        message: "Patient profile updated successfully!",
        color: "green",
      });
    } catch (err) {
      console.error("❌ Failed to update:", err);
      notifications.show({
        title: "Update Failed",
        message: "Something went wrong while updating the profile.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditableInfo(initialInfo);
    setAvatar(initialAvatar);
    setIsEditing(false);
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
      <Paper shadow="lg" radius="xl" style={{ padding: "2rem", backgroundColor: "#f5f5f5" }}>
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
            <Title order={2}>{editableInfo.name}</Title>
            <Text color="dimmed" size="lg">{editableInfo.email}</Text>
          </Stack>
        </Group>

        {/* Edit / Save / Cancel Buttons */}
        <Group align="center" justify="flex-end" mb="md">
          {!isEditing ? (
            <Button size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button
                size="sm"
                color="green"
                onClick={handleSave}
                loading={loading}
                disabled={loading}
              >
                {loading ? <Loader size="xs" color="white" /> : "Save"}
              </Button>
              <Button size="sm" color="red" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
            </>
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

          {/* Aadhaar Number */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Aadhaar Number</Text>
              {isEditing ? (
                <TextInput
                  value={editableInfo.adharNO}
                  onChange={(e) => {
                    const val = e.currentTarget.value.replace(/\D/g, "");
                    if (val.length <= 12) handleChange("adharNO", val);
                  }}
                  placeholder="Enter 12-digit Aadhaar"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.adharNO}</Text>
              )}
            </Card>
          </Grid.Col>

          {/* Blood Group */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <Card shadow="sm" p="md" radius="md" withBorder>
              <Text size="sm" color="dimmed">Blood Group</Text>
              {isEditing ? (
                <Select
                  data={bloodGroups}
                  value={editableInfo.bloodGroup}
                  onChange={(value) => handleChange("bloodGroup", value)}
                  placeholder="Select blood group"
                  mt="xs"
                />
              ) : (
                <Text size="md" fw={500} mt="xs">{editableInfo.bloodGroup}</Text>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PatientProfile;

















