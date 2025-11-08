import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReportPage from "./pages/Report";
import NotFound from "./pages/not-found";
import LandingPage from "./pages/Landing";
import SignInPage from "./pages/auth/signin";
import SignUpPage from "./pages/auth/signup";
import EmployeeList from "./pages/courses";
import AssessmentsPage from "./pages/assessments";
import { ToastContainer } from "react-toastify";
import AssessmentsByEmployeePage from "./pages/assessments-by-employee";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedLayout } from "./components/ProtectedRoute";
import { GuestLayout } from "./components/GuestRoute";
import CriteriaPage from "./pages/criteria";
import { DashboardRoute } from "./components/DashboardRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<GuestLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
          </Route>
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/employee" element={<EmployeeList />} />
            <Route path="/assessments" element={<AssessmentsPage />} />
            <Route path="/criteria" element={<CriteriaPage />} />
            <Route path="/assessments/:employeeId" element={<AssessmentsByEmployeePage />} />
            <Route path="/reports" element={<ReportPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
