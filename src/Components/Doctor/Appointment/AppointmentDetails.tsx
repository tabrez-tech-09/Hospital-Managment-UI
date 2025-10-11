import {
  Anchor,
  Breadcrumbs,
  Text,
  Card,
  Badge,
  Group,
  Stack,
  Divider,
  Container,
  ThemeIcon,
  Tabs,
  Title,
} from "@mantine/core";
import {
  CalendarEvent,
  User,
  At,
  Phone,
  Stethoscope,
  Notes,
  ClipboardText,
} from "tabler-icons-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAppointmentDetails } from "../../../Service/AppointmentService";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import ApReport from "./ApReport";

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointments] = useState<any>({});

  useEffect(() => {
    if (id) {
      getAppointmentDetails(id)
        .then((res) => {
          setAppointments(res);
        })
        .catch((err) => {
          console.error("error fetching appointment details", err);
        });
    }
  }, [id]);

  const statusColors = {
    SCHEDULED: "blue",
    COMPLETED: "green",
    CANCELLED: "red",
  };

  return (
    <Container size="md" style={{ marginTop: 20 }}>
      {/* Breadcrumb */}
      <Breadcrumbs mb="md">
        <Link to="/doctor/dashboard" className="text-primary-500 hover:underline">
          Dashboard
        </Link>
        <Link to="/doctor/appointments" className="text-primary-500 hover:underline">
          Appointments
        </Link>
        <Text c="dimmed">Details</Text>
      </Breadcrumbs>

      {/* Appointment Info */}
      {appointment && appointment.id ? (
        <Card shadow="md" radius="md" withBorder p="lg"  >
          <Stack gap="sm">
            <Group justify="space-between">
              <Title order={3}>Appointment Details</Title>
              <Badge
                color={statusColors[appointment.status as keyof typeof statusColors] || "gray"}
                variant="filled"
              >
                {appointment.status}
              </Badge>
            </Group>

            <Divider my="sm" />

            <Group gap="xs">
              <ThemeIcon color="blue" variant="light">
                <CalendarEvent size={16} />
              </ThemeIcon>
              <Text>
                <strong>Date & Time:</strong>{" "}
                {new Date(appointment.appointmentTime).toLocaleString()}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="teal" variant="light">
                <Stethoscope size={16} />
              </ThemeIcon>
              <Text>
                <strong>Doctor:</strong> {appointment.doctorName}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="green" variant="light">
                <User size={16} />
              </ThemeIcon>
              <Text>
                <strong>Patient:</strong> {appointment.patientName}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="gray" variant="light">
                <At size={16} />
              </ThemeIcon>
              <Text>
                <strong>Email:</strong> {appointment.patientEmail}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="orange" variant="light">
                <Phone size={16} />
              </ThemeIcon>
              <Text>
                <strong>Phone:</strong> {appointment.patientPhone || "Not Provided"}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="violet" variant="light">
                <ClipboardText size={16} />
              </ThemeIcon>
              <Text>
                <strong>Reason:</strong> {appointment.reason}
              </Text>
            </Group>

            <Group gap="xs">
              <ThemeIcon color="pink" variant="light">
                <Notes size={16} />
              </ThemeIcon>
              <Text>
                <strong>Notes:</strong> {appointment.notes}
              </Text>
            </Group>
          </Stack>
        </Card>
      ) : (
        <Text>Loading appointment details...</Text>
      )}

      {/* Tabs Section */}
      <Tabs my="xl" variant="outline" defaultValue="Medical">
        <Tabs.List>
          <Tabs.Tab value="Medical" leftSection={<IconPhoto size={14}  />}>
            Medical History
          </Tabs.Tab>
          <Tabs.Tab value="Prescription" leftSection={<IconMessageCircle size={14} />}>
            Prescription
          </Tabs.Tab>
          <Tabs.Tab value="Report" leftSection={<IconSettings size={14} />}>
            Report
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="Medical" p="md">
          <Card shadow="sm" withBorder radius="md">
            <Text c="dimmed">Medical history details will appear here.</Text>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="Prescription" p="md">
          <Card shadow="sm" withBorder radius="md">
            <Text c="dimmed">Prescription details will appear here.</Text>
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="Report" p="md">
          <ApReport appointment={appointment} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default AppointmentDetails;



