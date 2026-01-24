import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";
import MyApplications from "./pages/MyApplications";
import AuthenticationPage from "./pages/authenticationPage";
import OpportunityDetails from "./pages/OpportunityDetails";
import AdminPanel from "./pages/AdminPanel";
import ManageOpportunities from "./pages/ManageOpportunities";
import Unauthorized from "./pages/Unauthorized";
import AdminUserManagement from "./pages/AdminUserManagement";

import UserDashboard from "./pages/UserDashboard";

import ProtectedRoute from "./components/ProtectedRoute";


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

  
 
        {/* Protected Routes */}
        <Route path="/my-applications" element={
          <ProtectedRoute role="volunteer"><MyApplications /></ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>
        } />

        <Route path="/admin/users" element={
          <ProtectedRoute role="admin"><AdminUserManagement /></ProtectedRoute>
        } />

        <Route  path="/dashboard" element={
          <ProtectedRoute>  <UserDashboard /> </ProtectedRoute>
        }/>

        <Route path="/manage-opportunities" element={
          <ProtectedRoute role="organization"> <ManageOpportunities /> </ProtectedRoute>
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
