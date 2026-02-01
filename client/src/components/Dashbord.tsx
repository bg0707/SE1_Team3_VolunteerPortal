import { useState } from "react";

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const isVolunteer = !!user.fullName;
  const isOrganization = !!user.organizationName;

  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fullName: user.fullName || "",
    age: user.age || "",
    organizationName: user.organizationName || "",
    description: user.description || "",
    password: "",
  });

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in");

    try {
      // Ensure age is a number
      const formData = {
        ...form,
        age: form.age ? Number(form.age) : undefined,
      };

      const response = await fetch("http://localhost:3001/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Update failed:", text);
        return;
      }

      const data = await response.json();
      console.log("Profile updated:", data);
      alert("Profile updated successfully");

      // Update localStorage so the user sees the new info immediately
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, ...formData })
      );

      setEditMode(false);
       window.location.reload();
    } catch (err) {
      console.error("Network error:", err);
    }
    
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-[360px] p-8 rounded-xl bg-white shadow-lg text-center">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-4">
          Welcome,{" "}
          {isVolunteer
            ? user.fullName
            : isOrganization
            ? user.organizationName
            : "User"}
        </h1>

        {/* Email & Role */}
        <p className="text-gray-600 mb-2">
          <span className="font-bold">Email:</span> {user.email}
        </p>
        <p className="text-gray-600 mb-4">
          <span className="font-bold">Role:</span> {user.role}
        </p>

        {/* Volunteer */}
        {isVolunteer && (
          <>
            {editMode ? (
              <>
                <input
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                />
                <input
                  className="w-full mb-2 p-2 border rounded"
                  type="number"
                  placeholder="Age"
                  value={form.age}
                  onChange={(e) =>
                    setForm({ ...form, age: e.target.value })
                  }
                />
              </>
            ) : (
              <p className="text-gray-600 mb-2">
                <span className="font-bold">Age:</span> {user.age}
              </p>
            )}
          </>
        )}

        {/* Organization */}
        {isOrganization && (
          <>
            {editMode ? (
              <>
                <input
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Organization name"
                  value={form.organizationName}
                  onChange={(e) =>
                    setForm({ ...form, organizationName: e.target.value })
                  }
                />
                <textarea
                  className="w-full mb-2 p-2 border rounded"
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Description:</span>{" "}
                  {user.description}
                </p>
                <p className="text-gray-600 mb-2">
                  <span className="font-bold">Verified:</span>{" "}
                  {String(user.isVerified)}
                </p>
              </>
            )}
          </>
        )}

        {/* Password */}
        {editMode && (
          <input
            className="w-full mb-4 p-2 border rounded"
            type="password"
            placeholder="New password (optional)"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
        )}

        {/* Buttons */}
        {editMode ? (
          <>
            <button
              className="w-full py-2 mb-2 rounded bg-green-500 text-white font-bold hover:bg-green-600"
              onClick={handleSave}
            >
              Save changes
            </button>
            <button
              className="w-full py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            className="mt-4 w-full py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600"
            onClick={() => setEditMode(true)}
          >
            Edit profile
          </button>
        )}

        {/* Logout */}
        <button
          className="mt-6 w-full py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600"
          onClick={onLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}