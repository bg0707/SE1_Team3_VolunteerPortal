import Dashboard from "../components/Dashbord";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const onLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/authentication";
  };

  if (!user) {
    return <p className="text-center mt-10">Not logged in</p>;
  }

  return <Dashboard user={user} onLogout={onLogout} />;
}
