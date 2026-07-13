import Footer from "./components/common/Footer";
import { SignInRoute } from "./routes/public/SignInRoute";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./routes/common/ProtectedRoute";
import { HomeRoute } from "./routes/private/home/Home";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useConfigureQueryClient } from "./hooks/useConfigureQueryClient";
import { PublicRoute } from "./routes/common/PublicRoute";

function App() {
  return (
    <QueryClientProvider client={useConfigureQueryClient()}>
      <Router>
        <div className="bg-grid flex min-h-screen flex-col">
          <div className="flex-1">
            <Routes>
              <Route
                path="/"
                element={<PublicRoute children={<SignInRoute />} />}
              />
              <Route
                path="/home"
                element={<ProtectedRoute children={<HomeRoute />} />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
