import { useState } from "react";

interface Props {
  initialNotes?: string;
  initialPreferences?: string;
  onSubmit: (data: { notes?: string; preferences?: string }) => void;
}

const UpdateApplicationForm = ({
  initialNotes = "",
  initialPreferences = "",
  onSubmit,
}: Props) => {
  const [notes, setNotes] = useState(initialNotes);
  const [preferences, setPreferences] = useState(initialPreferences);

  return (
    <div className="mt-6 border p-5 rounded-xl shadow-sm bg-white">
      <h3 className="text-xl font-semibold mb-4">Update Application</h3>

      <label className="block font-medium mb-1">Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-300"
        rows={3}
      />

      <label className="block font-medium mb-1">Preferences</label>
      <textarea
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring focus:ring-blue-300"
        rows={3}
      />

      <button
        onClick={() => onSubmit({ notes, preferences })}
        className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        Save Changes
      </button>
    </div>
  );
};

export default UpdateApplicationForm;
