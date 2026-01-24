import { useEffect, useMemo, useRef, useState } from "react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import defaultAvatar from "../assets/avatar.avif";
import { Bell } from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  type Notification,
} from "../api/notifications.api";

export default function NavBar() {
  const [open, setOpen] = useState(false);

  const { user, logout, token } = useAuth();
  const authToken = useMemo(() => token ?? "", [token]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [notifOffset, setNotifOffset] = useState(0);
  const notifLimit = 2;
  const [notifHasMore, setNotifHasMore] = useState(true);
  const notifRef = useRef<HTMLLIElement | null>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const loadNotifications = async (opts?: { reset?: boolean }) => {
    if (!authToken) {
      setNotifications([]);
      setNotifOffset(0);
      setNotifHasMore(false);
      return [];
    }

    try {
      const reset = opts?.reset ?? false;
      const offset = reset ? 0 : notifOffset;
      const data = await fetchNotifications(authToken, {
        limit: notifLimit,
        offset,
      });
      setNotifications((prev) => (reset ? data : [...prev, ...data]));
      setNotifOffset(offset + data.length);
      setNotifHasMore(data.length === notifLimit);
      setNotifError(null);
      return data;
    } catch (error: any) {
      setNotifError(error?.message ?? "Failed to load notifications");
      return [];
    }
  };

  useEffect(() => {
    loadNotifications({ reset: true });
  }, [authToken]);

  useEffect(() => {
    if (!notifOpen) return;

    const handleOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (notifRef.current && target && !notifRef.current.contains(target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [notifOpen]);

  const toggleNotifications = async () => {
    if (!authToken) return;
    const willOpen = !notifOpen;
    setNotifOpen(willOpen);

    if (willOpen) {
      try {
        await loadNotifications({ reset: true });
      } catch (error: any) {
        setNotifError(error?.message ?? "Failed to load notifications");
      }
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!authToken || notification.isRead) return;
    try {
      await markNotificationRead(authToken, notification.notificationId);
      setNotifications((prev) =>
        prev.map((item) =>
          item.notificationId === notification.notificationId
            ? { ...item, isRead: true }
            : item
        )
      );
    } catch (error: any) {
      setNotifError(error?.message ?? "Failed to mark notification read");
    }
  };

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
                className="block py-2 px-3 hover:text-fg-brand"
              >
                Browse Opportunities
              </a>
            </li>

            {/* Volunteers only */}
            {user?.role === "volunteer" && (
              <li>
                <a href="/my-applications" className="block py-2 px-3 hover:text-fg-brand">
                  My Applications
                </a>
              </li>
            )}

            {/* Organizations only */}
            {user?.role === "organization" && (
              <li>
                <a href="/manage-opportunities" className="block py-2 px-3 hover:text-fg-brand">
                  Manage Opportunities
                </a>
              </li>
            )}

            {/* Admin only */}
            {user?.role === "admin" && (
              <li>
                <a
                  href="/admin"
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

            {/* Notifications — only show if logged in */}
            {user && (
              <li className="relative" ref={notifRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative block py-2 px-3 hover:text-fg-brand"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-default rounded-base shadow-lg z-30">
                    <div className="px-4 py-2 text-sm font-semibold border-b border-default">
                      Notifications
                    </div>
                    <ul className="max-h-80 overflow-auto">
                      {notifError && (
                        <li className="px-4 py-3 text-sm text-red-600">
                          {notifError}
                        </li>
                      )}
                      {!notifError && notifications.length === 0 && (
                        <li className="px-4 py-3 text-sm text-gray-500">
                          No notifications
                        </li>
                      )}
                      {!notifError &&
                        notifications.map((notification) => (
                          <li
                            key={notification.notificationId}
                            className={`px-4 py-3 text-sm border-b border-default ${
                              notification.isRead
                                ? "text-gray-500"
                                : "text-gray-900 font-medium"
                            }`}
                          >
                            <button
                              onClick={() =>
                                handleNotificationClick(notification)
                              }
                              className="text-left w-full"
                            >
                              <div>{notification.message}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </div>
                            </button>
                          </li>
                        ))}
                      {!notifError && notifHasMore && (
                        <li className="px-4 py-3 text-sm">
                          <button
                            onClick={() => loadNotifications()}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Load more
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </li>
            )}

            {/* Logout — only show if logged in */}
            {user && (
              <li>
                <a href="/dashboard" title="User Dashbord">
                  <img
                  src={defaultAvatar}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full border border-gray-300"
                  />
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
