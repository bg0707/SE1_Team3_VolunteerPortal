import { useState } from "react";
import LoginForm from "../components/loginForm";
import VolunteerRegistrationForm from "../components/registerVolunteerForm";
import OrganizationRegistrationForm from "../components/registerOrganizationForm";

export default function AuthenticationPage() {
  const [view, setView] = useState<"login" | "volunteer" | "organization">("login");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[360px] p-8 rounded-xl bg-white shadow-lg text-center">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">
          {view === "login"
            ? "Login"
            : view === "volunteer"
            ? "Register as Volunteer"
            : "Register as Organization"}
        </h1>

        {/* Forms */}
        {view === "login" && <LoginForm />}
        {view === "volunteer" && <VolunteerRegistrationForm />}
        {view === "organization" && <OrganizationRegistrationForm />}

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          {view !== "login" && (
            <button
              className="py-2 rounded-md border border-blue-500 text-blue-500 font-bold hover:bg-blue-50"
              onClick={() => setView("login")}
            >
              ← Back to Login
            </button>
          )}

          {view === "login" && (
            <>
              <button
                className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
                onClick={() => setView("volunteer")}
              >
                Register as Volunteer
              </button>

              <button
                className="py-2 rounded-md bg-blue-500 text-white font-bold hover:bg-blue-600"
                onClick={() => setView("organization")}
              >
                Register as Organization
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
