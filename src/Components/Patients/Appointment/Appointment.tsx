import React, { useState, useEffect } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Slider, SliderChangeEvent } from "primereact/slider";
import { Tag } from "primereact/tag";
import { Button, Modal, TextInput, Select, LoadingOverlay, ActionIcon,Text, SegmentedControl } from "@mantine/core";
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { DateTimePicker } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { getDropDownDoctor } from "../../../Service/DoctorProfileService";
import { useForm } from "@mantine/form";
import { successNotification, unsuccessNotification } from "../../../Util/NotificationUtil";
import { cancelAppointment, getAppointmentByPatient, scheduleAppointment } from "../../../Service/AppointmentService";
import { modals } from "@mantine/modals";
import { Toolbar } from "primereact/toolbar";

// ---------- Types ----------
interface Country {
  name: string;
  code: string;
}

interface Representative {
  name: string;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

interface DoctorOption {
  value: string;
  label: string;
}

interface AppointmentFormValues {
  doctorId: string;
  patientId: string;
  appointmentTime: Date | null;
  reason: string;
  notes: string;
}

const appointmentReasons = [
  { value: "general_checkup", label: "General Check-up" },
  { value: "follow_up", label: "Follow-up Visit" },
  { value: "consultation", label: "Consultation" },
  { value: "test_review", label: "Test Review" },
  { value: "vaccination", label: "Vaccination" },
  { value: "emergency", label: "Emergency Visit" },
];

const Appointment: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const user = { profileId: "10" }; // replace with your selector
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [tab, setTab] = useState<string>('today');

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    "doctor.name": {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    appointmentTime: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    doctorName: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    status: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
     notes: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
  });

  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const [representatives] = useState<Representative[]>([
    { name: "Amy Elsner", image: "amyelsner.png" },
    { name: "Anna Fali", image: "annafali.png" },
    { name: "Asiya Javayant", image: "asiyajavayant.png" },
    { name: "Bernardo Dominic", image: "bernardodominic.png" },
    { name: "Elwin Sharvill", image: "elwinsharvill.png" },
    { name: "Ioni Bowcher", image: "ionibowcher.png" },
    { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
    { name: "Onyama Limba", image: "onyamalimba.png" },
    { name: "Stephen Shaw", image: "stephenshaw.png" },
    { name: "XuXue Feng", image: "xuxuefeng.png" },
  ]);

  const [statuses] = useState<string[]>([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  // Severity helper
  const getSeverity = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "danger";
      case "COMPLETED":
        return "success";
      case "SCHEDULED":
        return "info";
      default:
        return null;
    }
  };

  // ---- Fetch doctors ----
  useEffect(() => {
    fatchData();

    const fetchDoctors = async () => {
      try {
        const data = await getDropDownDoctor();
        setDoctors(
          data.map((doc: any) => ({
            value: String(doc.id),
            label: doc.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Utilities
const formatDateTime = (value: string | Date) =>
  new Date(value).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // set false if you prefer 24-hour format
  });

// ✅ column body template
const timeTemplate = (rowData: any) => {
  return <span>{formatDateTime(rowData.appointmentTime)}</span>;
};

  const formatCurrency = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      global: { ...prev.global, value },
    }));
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex flex-wrap gap-2 justify-content-between items-center">
      <Button leftSection={<IconPlus />} onClick={open} variant="filled">
        Schedule Appointment
      </Button>
      <TextInput
        leftSection={<IconSearch />}
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Keyword Search"
      />
    </div>
  );

  // Table templates (unchanged)
  const countryBodyTemplate = (rowData: Customer) => (
    <div className="flex align-items-center gap-2">
      <img
        alt="flag"
        src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png"
        className={`flag flag-${rowData.country.code}`}
        style={{ width: "24px" }}
      />
      <span>{rowData.country.name}</span>
    </div>
  );

  const representativeBodyTemplate = (rowData: Customer) => (
    <div className="flex align-items-center gap-2">
      <img
        alt={rowData.representative.name}
        src={`https://primefaces.org/cdn/primereact/images/avatar/${rowData.representative.image}`}
        width="32"
      />
      <span>{rowData.representative.name}</span>
    </div>
  );



  const representativesItemTemplate = (option: Representative) => (
    <div className="flex align-items-center gap-2">
      <img
        alt={option.name}
        src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`}
        width="32"
      />
      <span>{option.name}</span>
    </div>
  );

  const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <>
      <div className="mb-3 font-bold">Agent Picker</div>
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={representativesItemTemplate}
        onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
      />
    </>
  );

  const dateBodyTemplate = (rowData: Customer) => formatDateTime(rowData.date);
  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <Calendar
      value={options.value}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      dateFormat="mm/dd/yy"
      placeholder="mm/dd/yyyy"
      mask="99/99/9999"
    />
  );

  const balanceBodyTemplate = (rowData: Customer) => formatCurrency(rowData.balance);
  const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <InputNumber
      value={options.value}
      onChange={(e) => options.filterCallback(e.value, options.index)}
      mode="currency"
      currency="USD"
      locale="en-US"
    />
  );

  const statusBodyTemplate = (rowData: Customer) => (
    <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  );

  const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <Dropdown
      value={options.value}
      options={statuses}
      onChange={(e: DropdownChangeEvent) =>
        options.filterCallback(e.value, options.index)
      }
      itemTemplate={(opt: string) => <Tag value={opt} severity={getSeverity(opt)} />}
      placeholder="Select One"
      className="p-column-filter"
      showClear
    />
  );

  const activityBodyTemplate = (rowData: Customer) => (
    <ProgressBar value={rowData.activity} showValue={false} style={{ height: "6px" }} />
  );

  const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => (
    <>
      <Slider
        value={options.value}
        onChange={(e: SliderChangeEvent) => options.filterCallback(e.value)}
        range
        className="m-3"
      />
      <div className="flex align-items-center justify-content-between px-2">
        <span>{options.value ? options.value[0] : 0}</span>
        <span>{options.value ? options.value[1] : 100}</span>
      </div>
    </>
  );

const handleDelete = (rowData: any) => {
  modals.openConfirmModal({
    title: (
      <span className="text-xl font-serif font-semibold">
        Are you sure?
      </span>
    ),
    centered: true,
    children: (
      <Text size="sm" color="dimmed">
        Once removed, all details and reminders will be lost,
        and the time slot will be made available again.
      </Text>
    ),
    labels: { confirm: "Confirm", cancel: "Cancel" },

    onCancel: () => console.log("Cancel"),

    onConfirm: () => {
      setLoading(true);

      cancelAppointment(rowData.id)
        .then(() => {
          successNotification(
            "Success",
            "Appointment cancelled successfully"
          );

          // ✅ mark only the chosen appointment as cancelled
          setAppointments((prev) =>
            prev.map((a) =>
              a.id === rowData.id
                ? { ...a, status: "cancelled" }
                : a
            )
          );
        })
        .catch((error) => {
          unsuccessNotification(
            "Error",
            error.response?.data?.errorMessage ||
              "Failed to cancel appointment"
          );
        })
        .finally(() => setLoading(false));
    },
  });

  console.log("Delete clicked:", rowData);
};

    const leftToolbarTemplate = () => {
        return (
          <Button leftSection={<IconPlus />} onClick={open} variant="filled">
        Schedule Appointment
      </Button>
        );
    };

    const rightToolbarTemplate = () => {
        return ( <TextInput
        leftSection={<IconSearch />}
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Keyword Search"
      />);
    };

const centerToolbarTemplate = () => {
  return (
    <SegmentedControl
      value={tab}
      variant="filled"
      color={tab === "today" ? "blue" : tab ==="upcoming" ? "green" : "red"}
      onChange={setTab}
      data={[
        { label: "Today", value: "today" },
        { label: "Upcoming", value: "upcoming" },
        { label: "Past", value: "past" },
      ]}
    />
  );
};

const filteredAppointment = appointments.filter((appointment) => {
  const appointmentDate = new Date(appointment.appointmentTime);
  const today = new Date();

  if (tab === "today") {
    return appointmentDate.toDateString() === today.toDateString();
  } else if (tab === "upcoming") {
    return appointmentDate > today;
  } else if (tab === "past") {
    return appointmentDate < today;
  }

  return true; // fallback if `tab` has some other value
});


  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex  gap-2">
        <ActionIcon ><IconEdit size={20} stroke={1.5}/> </ActionIcon>
        <ActionIcon onClick={() => handleDelete(rowData)}><IconTrash color="red" size={20} stroke={1.5} /> </ActionIcon>
      </div>
    )
  }

  // ---- Mantine Form ----
  const form = useForm<AppointmentFormValues>({
    initialValues: {
      doctorId: "",
      patientId: user.profileId,
      appointmentTime: null,
      reason: "",
      notes: "",
    },
    validate: {
      doctorId: (v: string) =>
        v.trim().length === 0 ? "Please select a doctor" : null,
      patientId: (v: string) =>
        v.trim().length === 0 ? "Please enter patient ID" : null,
      appointmentTime: (v: Date | null) =>
        !v ? "Please choose an appointment time" : null,
      reason: (v: string) =>
        v.trim().length === 0 ? "Reason for appointment is required" : null,
    },
  });

  const handleSubmit = async (values: AppointmentFormValues) => {
  console.log("Appointment scheduled", values);
  setLoading(true);

  try {
    await scheduleAppointment(values);

    close();               // make sure this is defined
    form.reset();  
    fatchData();        
    successNotification("Success", "Appointment is successfully registered");
  } catch (error) {
    if (typeof error === "object" && error !== null && "response" in error) {
      // @ts-ignore
      console.error("Error scheduling appointment:", error.response?.data || error);
    } else {
      console.error("Error scheduling appointment:", error);
    }
    unsuccessNotification("Error", "Appointment could not be registered");
  } finally {
    setLoading(false);
  }
};

 const fatchData = ()=>{
      getAppointmentByPatient(user.profileId)
  .then((data) => {
    setAppointments(data);
  })
  .catch((error) => console.error("Error fetching appointments:", error));
 }



  const header = renderHeader();

  return (
    <div className="card">
       <Toolbar className="mb-4" left={leftToolbarTemplate} center={centerToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
      {/* Data Table */}
      <DataTable
        stripedRows
        value={filteredAppointment}
        paginator
        rows={5}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id"
        selectionMode="checkbox"
        selection={selectedCustomers}
        onSelectionChange={(e) => setSelectedCustomers(e.value as Customer[])}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          "doctorName",
          "doctor.name",
          "appointmentTime",
          "reason",
          "status",
          "notes",
        ]}
        emptyMessage="No appointment found."
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      >
        <Column
          field="doctorName"
          header="Doctor"
          sortable
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "14rem" }}
        />

        <Column
          field="appointmentTime"
          header="Appointment Time"
          sortable
          body={timeTemplate}
          style={{ minWidth: "14rem" }}
        />

         <Column
          field="reason"
          header="Reason"
          sortable
          style={{ minWidth: "14rem" }}
        />
          <Column
          field="notes"
          header="Note"
          sortable
          style={{ minWidth: "14rem" }}
        />

         <Column
          field="status"
          header="Status"
          sortable
          filterMenuStyle={{ width: "14rem" }}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusFilterTemplate}
        />
        <Column
          headerStyle={{ width: "5rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center", overflow: "visible" }}
          body={actionBodyTemplate}
        />
      </DataTable>

      {/* Modal Form */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <div className="text-xl text-primary-400 font-semibold flex items-center gap-2">
            <IconPlus /> Schedule Appointment
          </div>
        }
      >
       <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        <form
          onSubmit={form.onSubmit(handleSubmit)}
          className="grid grid-cols-1 gap-5"
        >
          <Select
            withAsterisk
            label="Doctor"
            placeholder="Select a doctor"
            data={doctors}
            {...form.getInputProps("doctorId")}
          />

          <DateTimePicker
          minDate={new Date()}
            withAsterisk
            label="Pick date & appointment time"
            placeholder="Pick Appointment Time"
            {...form.getInputProps("appointmentTime")}
          />

          <Select
            withAsterisk
            label="Reason for Appointment"
            placeholder="Select reason"
            data={appointmentReasons}
            {...form.getInputProps("reason")}
          />

          <TextInput
            label="Additional note"
            placeholder="Enter additional note"
            {...form.getInputProps("notes")}
          />

          <Button type="submit" variant="filled" fullWidth>
            Submit
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Appointment;
