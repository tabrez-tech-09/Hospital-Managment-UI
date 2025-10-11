import React from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  MultiSelect,
  TextInput,
  Card,
  Stack,
  Divider,
  Title,
  Select,
  NumberInput,
  Textarea,
  ActionIcon,
  Group,
  Button,
  Grid,
} from "@mantine/core";
import DropDown from "../../../Data/DropDown";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { createAppointmentReport } from "../../../Service/AppointmentService";

// Prescription type
interface Prescription {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: number;
  route: string;
  type: string;
  instructions: string;
  notes: string;
}

interface FormValues {
  symptoms: string[];
  tests: string[];
  diagnosis: string;
  referral: string;
  notes: string;
  prescription: Prescription[];
}

interface ApReportProps {
  appointment: any; // Replace with your Appointment type if available
}

const ApReport: React.FC<ApReportProps> = ({ appointment }) => {
  const form: UseFormReturnType<FormValues> = useForm<FormValues>({
    initialValues: {
      symptoms: [],
      tests: [],
      diagnosis: "",
      referral: "",
      notes: "",
      prescription: [
        {
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: 0,
          route: "",
          type: "",
          instructions: "",
          notes: "",
        },
      ],
    },
    validate: {
      symptoms: (value) =>
        value.length === 0 ? "At least one symptom is required" : null,
      diagnosis: (value) =>
        value.trim() === "" ? "Diagnosis is required" : null,
      prescription: (value) => {
        if (value.length === 0) return "At least one prescription is required";
        for (let i = 0; i < value.length; i++) {
          if (!value[i].medicineName.trim()) return `Medicine Name is required for prescription ${i + 1}`;
          if (!value[i].dosage.trim()) return `Dosage is required for prescription ${i + 1}`;
        }
        return null;
      },
    },
  });

  const handleSubmit = (values: FormValues) => {
    // Build backend-compatible JSON
    const data = {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointment: { id: appointment.id },
      symptoms: values.symptoms,
      diagnosis: values.diagnosis,
      tests: values.tests,
      notes: values.notes,
      referral: values.referral,
      followUpDate: new Date().toISOString().split("T")[0], // today's date
      prescription: {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        appointmentId: appointment.id,
        prescriptionDate: new Date().toISOString().split("T")[0],
        notes: "Take after meals",
        medicines: values.prescription.map((p) => ({
          name: p.medicineName,
          dosage: p.dosage,
          frequency: p.frequency,
          duration: p.duration,
          route: p.route,
          type: p.type,
          instruction: p.instructions,
        })),
      },
    };

    createAppointmentReport(data)
      .then((res) => {
        console.log("Report created successfully:", res);
        form.reset();
      })
      .catch((err) => {
        console.error("Error creating report:", err);
      });

    console.log("Data to be sent:", data);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} className="p-4">
      {/* Patient Report Section */}
      <Card shadow="sm" radius="md" withBorder p="lg" mb="lg">
        <Title order={4} mb="md" c="primary.6">
          Patient Report
        </Title>
        <Divider mb="lg" />
        <Stack>
          <MultiSelect
            label="Symptoms"
            placeholder="Select symptoms"
            searchable
            {...form.getInputProps("symptoms")}
            data={DropDown.symptoms}
          />
          <MultiSelect
            label="Tests"
            placeholder="Select tests"
            searchable
            {...form.getInputProps("tests")}
            data={DropDown.tests}
          />
          <TextInput
            label="Diagnosis"
            placeholder="Enter Diagnosis"
            {...form.getInputProps("diagnosis")}
          />
          <TextInput
            label="Referral"
            placeholder="Enter Referral"
            {...form.getInputProps("referral")}
          />
          <Textarea
            label="Notes"
            placeholder="Enter Notes"
            {...form.getInputProps("notes")}
          />
        </Stack>
      </Card>

      {/* Prescription Section */}
      <Card shadow="sm" radius="md" withBorder p="lg">
        <Group style={{ justifyContent: "space-between" }} mb="md">
          <Title order={4} c="primary.6">
            Prescription
          </Title>
          <ActionIcon
            color="green"
            variant="filled"
            onClick={() =>
              form.setFieldValue("prescription", [
                ...form.values.prescription,
                {
                  medicineName: "",
                  dosage: "",
                  frequency: "",
                  duration: 0,
                  route: "",
                  type: "",
                  instructions: "",
                  notes: "",
                },
              ])
            }
          >
            <IconPlus size={18} />
          </ActionIcon>
        </Group>
        <Divider mb="lg" />

        {form.values.prescription.map((item, index) => (
          <Card key={index} withBorder shadow="xs" p="md" mb="md">
            <Grid gutter="md">
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Medicine"
                  placeholder="Enter Medicine Name"
                  {...form.getInputProps(`prescription.${index}.medicineName`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Dosage"
                  placeholder="Enter Dosage"
                  {...form.getInputProps(`prescription.${index}.dosage`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Frequency"
                  placeholder="Select Frequency"
                  data={DropDown.frequencyOptions.map((opt) => ({
                    label: opt.label,
                    value: Array.isArray(opt.value) ? opt.value.join("-") : opt.value,
                  }))}
                  {...form.getInputProps(`prescription.${index}.frequency`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <NumberInput
                  label="Duration (days)"
                  placeholder="Enter Duration"
                  min={0}
                  {...form.getInputProps(`prescription.${index}.duration`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Route"
                  placeholder="Select Route"
                  data={[
                    { value: "Oral", label: "Oral" },
                    { value: "Injection", label: "Injection" },
                    { value: "Topical", label: "Topical" },
                  ]}
                  {...form.getInputProps(`prescription.${index}.route`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Select
                  label="Type"
                  placeholder="Select Type"
                  data={[
                    { value: "Tablet", label: "Tablet" },
                    { value: "Syrup", label: "Syrup" },
                    { value: "Capsule", label: "Capsule" },
                    { value: "Inhaler", label: "Inhaler" },
                  ]}
                  {...form.getInputProps(`prescription.${index}.type`)}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <TextInput
                  label="Instructions"
                  placeholder="Enter Instructions"
                  {...form.getInputProps(`prescription.${index}.instructions`)}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Group style={{ justifyContent: "flex-end" }}>
                  {form.values.prescription.length > 1 && (
                    <ActionIcon
                      color="red"
                      variant="outline"
                      onClick={() => form.removeListItem("prescription", index)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  )}
                </Group>
              </Grid.Col>
            </Grid>
          </Card>
        ))}

        <Button type="submit" fullWidth mt="md">
          Submit Report
        </Button>
      </Card>
    </form>
  );
};

export default ApReport;


//  private Long id;
//     private String name;
//     private Long medicineId;
//     private String dosage;
//     private String frequency;
//     private Integer duration;
//     private String route;
//     private String type;
//     private String inStruction;
//     private Long prescriptionId;

