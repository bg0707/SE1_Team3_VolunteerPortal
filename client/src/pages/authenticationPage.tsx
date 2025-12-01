import OrganizationRegistrationForm from "../components/registerOrganizationForm";
import VolunteerRegistrationForm from "../components/registerVolunteerForm";
import LoginForm from "../components/loginForm";

export default function AuthenticationPage() {
  return (
    <div>
      <h1>Login</h1>
      <LoginForm />
      <h1>Register as Volunteer</h1>
      <VolunteerRegistrationForm />
      <h1>Register as Organization</h1>
      <OrganizationRegistrationForm />
    </div>
  );
}
