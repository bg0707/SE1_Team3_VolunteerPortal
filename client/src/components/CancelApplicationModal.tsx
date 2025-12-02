import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
}

const CancelApplicationModal = ({ open, onClose, onConfirm }: Props) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-96 p-6 shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Cancel Application</h3>

        <p className="text-gray-600 text-sm mb-2">
          You can provide a reason (optional):
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:ring focus:ring-blue-300"
          placeholder="Reason (optional)"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Close
          </button>

          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelApplicationModal;
