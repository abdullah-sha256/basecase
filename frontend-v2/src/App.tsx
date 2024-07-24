import { Spacer } from "@chakra-ui/react";
import "./App.css";
import LandingNavbar from "./components/common/LandingNavbar";
import Footer from "./components/common/Footer";
import { LandingRoute } from "./routes/public/LandingRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <LandingNavbar />
      <Routes>
        <Route path="/" element={<LandingRoute />} />
      </Routes>
      <Spacer />
      <Footer />
    </Router>
  );
}

export default App;
