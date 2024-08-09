import { Spacer } from "@chakra-ui/react";
import "./App.css";
import Footer from "./components/common/Footer";
import { LandingRoute } from "./routes/public/LandingRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/common/ProtectedRoute";
import { HomeRoute } from "./routes/private/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { useConfigureQueryClient } from "./hooks/useConfigureQueryClient";
import { PublicRoute } from "./routes/common/PublicRoute";

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
    </QueryClientProvider>
  );
}

export default App;
