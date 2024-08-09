import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "@chakra-ui/pro-theme";

// Chakro UI Pro setup
const proTheme = extendTheme(theme);
const extenstion = {
  colors: {
    ...proTheme.colors,
    brand: proTheme.colors.red,
  },
};
const myTheme = extendTheme(extenstion, proTheme);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={myTheme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
