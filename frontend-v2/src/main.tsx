import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { theme } from "@chakra-ui/pro-theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Chakro UI Pro setup
const proTheme = extendTheme(theme);
const extenstion = {
  colors: {
    ...proTheme.colors,
    brand: proTheme.colors.red,
  },
};
const myTheme = extendTheme(extenstion, proTheme);

// React Query setup
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={myTheme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
