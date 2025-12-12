import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";
import MyApplications from "./pages/MyApplications";
import AuthenticationPage from "./pages/authenticationPage";
import OpportunityDetails from "./pages/OpportunityDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";


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