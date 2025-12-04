import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";
import AuthenticationPage from "./pages/authenticationPage";
import OpportunityDetails from "./pages/OpportunityDetails";


import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Opportunities />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/authentication" element={<AuthenticationPage />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />

 </Routes>
    </div>
  );
}

export default App;