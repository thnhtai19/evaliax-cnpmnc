import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/about";
import Dashboard from "./pages/dashboard";

import Reports from "./pages/reports";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import LandingPage from "./pages/Landing";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import EmployeeList from "./pages/courses";
import AssessmentsPage from "./pages/assessments";
import AssessmentsByEmployeePage from "./pages/assessments-by-employee";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employee" element={<EmployeeList />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:employeeId" element={<AssessmentsByEmployeePage />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
