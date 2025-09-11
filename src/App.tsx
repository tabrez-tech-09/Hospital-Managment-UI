import React from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css"; // ✅ जरूरी
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { Provider } from "react-redux";
import store from "./Store";

const theme = createTheme({
  focusRing: "never",
  fontFamily: "Poppins, sans-serif",
  headings: { fontFamily: "Merriweather, serif" },
});

function App() {
  return (
    <Provider store={store}>
      <MantineProvider theme={theme}>
        {/* ✅ notifications root पर होने चाहिए */}
        <Notifications position="top-center" />
        <AppRoutes />
      </MantineProvider>
    </Provider>
  );
}

export default App;



