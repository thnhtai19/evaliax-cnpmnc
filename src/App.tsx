import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import About from "./pages/about";
import Dashboard from "./pages/dashboard";

import Students from "./pages/students";
import Reports from "./pages/reports";
import Settings from "./pages/settings";
import NotFound from "./pages/not-found";
import EmployeeList from "./pages/courses";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/courses" element={<EmployeeList />} />
        <Route path="/students" element={<Students />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
