import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";
import MyApplications from "./pages/MyApplications";
import ApplicationDetails from "./pages/ApplicationDetails";

import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Opportunities />} />
        <Route path="/opportunities" element={<Opportunities />} />
        {/* Applications */}
        <Route path="/my-applications" element={<MyApplications />} />
        <Route path="/applications/:applicationId" element={<ApplicationDetails />} />
 </Routes>
    </div>
  );
}

export default App;