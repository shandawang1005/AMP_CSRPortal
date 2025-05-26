import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { createTicket } from "../features/tickets/ticketThunks";

export default function AddTicketModal({ clientId, onTicketCreated }) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    status: "open",
    description: "",
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await dispatch(
        createTicket({
          clientId,
          subject: formData.subject,
          description: formData.description,
          author: user._id,
        })
      );

      if (response.meta.requestStatus === "fulfilled") {
        onTicketCreated();
        setFormData({
          subject: "",
          status: "open",
          description: "",
        });
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  return (
    <>
      <button
        className="text-blue-600 font-medium px-6 py-2"
        onClick={() => setIsCreating(true)}
      >
        Add Ticket
      </button>

      {isCreating && (
        <Modal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          title="Create New Ticket"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Ticket Info</h3>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Ticket
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
