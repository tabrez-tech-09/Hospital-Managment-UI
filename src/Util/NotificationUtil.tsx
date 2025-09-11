import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export const successNotification = (message: string) => {
  notifications.show({
    title: "Success",
    message,
    color: "teal",
    icon: <IconCheck />,
    withCloseButton: true,
    withBorder: true,
    autoClose: 4000, // 3 seconds
  });
};

export const unsuccessNotification = (message: string) => {
  notifications.show({
    title: "Error",
    message,
    color: "red",
    icon: <IconX />,
    withCloseButton: true,
    withBorder: true,
    autoClose: 4000,
  });
};

