import { Spacer } from "@chakra-ui/react";
import "./App.css";
import Footer from "./components/common/Footer";
import { LandingRoute } from "./routes/public/LandingRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/common/ProtectedRoute";
import { HomeRoute } from "./routes/private/home/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { useConfigureQueryClient } from "./hooks/useConfigureQueryClient";
import { PublicRoute } from "./routes/common/PublicRoute";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={useConfigureQueryClient()}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<PublicRoute children={<LandingRoute />} />}
          />
          <Route
            path="/home"
            element={<ProtectedRoute children={<HomeRoute />} />}
          />
        </Routes>
        <Spacer />
        <Footer />
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
