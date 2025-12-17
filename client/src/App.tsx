import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";
import MyApplications from "./pages/MyApplications";
import AuthenticationPage from "./pages/authenticationPage";
import OpportunityDetails from "./pages/OpportunityDetails";
import ManageOpportunities from "./pages/ManageOpportunities";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPanel from "./pages/AdminPanel";
import UserDashboard from "./pages/UserDashbord";


import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Opportunities />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/authentication" element={<AuthenticationPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />
        {/* Organization Management */}
        <Route path="/manage-opportunities" element={<ManageOpportunities />} />
        {/* Error pages */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        {/* Protected Routes */}
        <Route path="/my-applications" element={
          <ProtectedRoute role="volunteer"><MyApplications /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
        } />

        {/*  Unauthorized  */}
        <Route 
          path="/unauthorized"
          element={<Unauthorized />
          }
        />
      </Routes>

    </div>
  );
}

export default App;