import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { updateClientBalance } from "../features/clients/clientsThunks";
import { addWashHistory } from "../features/vehicles/vehiclesThunks";

const EditVehicle = ({ vehicle, clientId, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.licensePlate,
    subscriptionType: vehicle.subscriptionType,
    color: vehicle.color,
    vin: vehicle.vin,
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const wasPayPerWash = vehicle.subscriptionType === "payPerWash";
    const nowMonthly = formData.subscriptionType === "monthly";

    if (wasPayPerWash && nowMonthly) {
      const now = new Date();
      const nextMonth = new Date(now);
      const updatedData = {
        ...formData,
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        subscriptionAmount: 30,
      };
      nextMonth.setMonth(now.getMonth() + 1);

      updatedData.subscriptionStartDate = now.toISOString();
      updatedData.subscriptionEndDate = nextMonth.toISOString();

      await dispatch(updateClientBalance({ clientId, amount: -30 }));
      await dispatch(
        addWashHistory({
          clientId,
          vehicleId: vehicle._id,
          historyData: {
            date: now,
            service: "Subscription Upgrade",
            price: -30,
            orderNumber: `${now.getFullYear()}${(now.getMonth() + 1)
              .toString()
              .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${
              Math.floor(Math.random() * 9000) + 1000
            }`,
          },
        })
      );
    }
    onUpdate(vehicle._id, formData);
    setIsEditing(false);
  };

  return (
    <>
      {/* Edit button */}
      <button
        className="text-blue-600 font-medium px-6 py-2"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>

      {/* Modal for editing vehicle */}
      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
          <form onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold mb-2">Vehicle Info</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Make
              </label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                License Plate
              </label>
              <input
                type="text"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Subscription Type
              </label>
              <select
                name="subscriptionType"
                value={formData.subscriptionType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="payPerWash">Pay-Per-Wash</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Color
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                VIN
              </label>
              <input
                type="text"
                name="vin"
                value={formData.vin}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default EditVehicle;
