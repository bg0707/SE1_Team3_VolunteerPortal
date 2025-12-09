import { useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuth();

  return (
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-default border-b">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo + Title */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-14" alt="Volunteer Logo" />
          <span className="self-center text-xl text-heading font-semibold whitespace-nowrap">
            Volunteer Portal
          </span>
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-heading rounded-base lg:hidden hover:bg-neutral-secondary-soft focus:outline-none focus:ring-2 focus:ring-neutral-tertiary"
        >
          <span className="sr-only">Open main menu</span>

          {/* Hamburger Icon */}
          {open ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Menu */}
        <div
          className={`${open ? "block" : "hidden"} w-full lg:block lg:w-auto`}
          id="navbar-default"
        >
          <ul className="flex flex-col font-medium p-4 lg:p-0 mt-4 border border-default rounded-base bg-neutral-secondary-soft lg:space-x-8 rtl:space-x-reverse lg:flex-row lg:mt-0 lg:border-0 lg:bg-neutral-primary">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-brand rounded lg:bg-transparent lg:text-fg-brand lg:p-0"
                aria-current="page"
              >
                Dashboard
              </a>
            </li>

            <li>
              <a
                href="/opportunities"
                className="block py-2 px-3 text-heading rounded hover:bg-neutral-tertiary lg:hover:bg-transparent lg:hover:text-fg-brand lg:p-0"
              >
                Browse Opportunities
              </a>
            </li>

            {/* Volunteers only */}
            {user?.role === "volunteer" && (
              <li>
                <a href="#" className="block py-2 px-3 hover:text-fg-brand">
                  My Applications
                </a>
              </li>
            )}

            {/* Organizations only */}
            {user?.role === "organization" && (
              <li>
                <a href="#" className="block py-2 px-3 hover:text-fg-brand">
                  Organization Dashboard
                </a>
              </li>
            )}

            {/* Admin only */}
            {user?.role === "admin" && (
              <li>
                <a
                  href="#"
                  className="block py-2 px-3 hover:text-fg-brand"
                >
                  Admin Panel
                </a>
              </li>
            )}

            {/* Login/Register — only show if NOT logged in */}
            {!user && (
              <li>
                <a
                  href="/authentication"
                  className="block py-2 px-3 hover:text-fg-brand"
                >
                  Login/Register
                </a>
              </li>
            )}

            {/* Logout — only show if logged in */}
            {user && (
              <li>
                <button
                  onClick={logout}
                  className="block py-2 px-3 text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
}
