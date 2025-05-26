import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { createTicket } from "../features/tickets/ticketThunks";
import {
  isRequired,
  minLength,
  composeValidators,
} from "../utils/validators.js";

export default function AddTicketModal({ clientId, onTicketCreated }) {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    status: "open",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const validate = () => {
    const newErrors = {};
    const subjectValidator = composeValidators(isRequired, minLength(3));
    const descriptionValidator = composeValidators(isRequired, minLength(5));

    newErrors.subject = subjectValidator(formData.subject);
    newErrors.description = descriptionValidator(formData.description);

    // filter out nulls
    Object.keys(newErrors).forEach(
      (key) => newErrors[key] === null && delete newErrors[key]
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
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
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
              )}
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
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
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
