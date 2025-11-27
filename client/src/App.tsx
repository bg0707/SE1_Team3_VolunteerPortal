import { Routes, Route } from "react-router-dom";
import Opportunities from "./pages/Opportunities";

import NavBar from "./components/NavBar";

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Opportunities />} />
        <Route path="/opportunities" element={<Opportunities />} />
 </Routes>
    </div>
  );
}

export default App;