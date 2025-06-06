import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { createVehicle } from "../features/vehicles/vehiclesThunks";
import { updateClientBalance } from "../features/clients/clientsThunks";
import { isRequired, minLength, composeValidators } from "../utils/validators";

const CreateVehicle = ({ clientId, onVehicleCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    subscriptionType: "payPerWash",
    color: "",
    vin: "",
  });
  const [errors, setErrors] = useState({});

  const { selectedClient, loading, error } = useSelector(
    (state) => state.clients
  );
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };
  const validate = () => {
    const validators = {
      make: composeValidators(isRequired, minLength(2)),
      model: composeValidators(isRequired, minLength(2)),
      year: (val) =>
        /^\d{4}$/.test(val) && val >= 1990 && val <= new Date().getFullYear()
          ? null
          : "Enter a valid year",
      licensePlate: composeValidators(isRequired, minLength(3)),
      vin: composeValidators(isRequired, minLength(6)), // just basic rule
    };

    const newErrors = {};
    for (let key in validators) {
      const error = validators[key](formData[key]);
      if (error) newErrors[key] = error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    //test balance
    if (formData.subscriptionType === "monthly") {
      const requiredAmount = 30;
      const currentBalance = selectedClient.balance;

      if (currentBalance < requiredAmount) {
        alert("Insufficient balance to create a monthly subscription vehicle.");
        return;
      }

      await dispatch(
        updateClientBalance({ clientId, amount: -requiredAmount })
      );
    }
    try {
      const response = await dispatch(
        createVehicle({ clientId, vehicleData: formData })
      );
      if (response.meta.requestStatus === "fulfilled") {
        onVehicleCreated();
        setFormData({
          make: "",
          model: "",
          year: "",
          licensePlate: "",
          subscriptionType: "payPerWash",
          color: "",
          vin: "",
        });
        setErrors({});
        setIsCreating(false);
      }
    } catch (error) {
      console.error("Error creating vehicle:", error);
    }
  };

  return (
    <>
      <button
        className="text-blue-600 font-medium px-6 py-2"
        onClick={() => setIsCreating(true)}
      >
        Add Vehicle
      </button>

      {isCreating && (
        <Modal
          isOpen={isCreating}
          onClose={() => setIsCreating(false)}
          title="Create New Vehicle"
        >
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Vehicle Info</h3>
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
              {errors.make && (
                <p className="text-red-500 text-sm mt-1">{errors.make}</p>
              )}
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
              {errors.model && (
                <p className="text-red-500 text-sm mt-1">{errors.model}</p>
              )}
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
              {errors.year && (
                <p className="text-red-500 text-sm mt-1">{errors.year}</p>
              )}
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
              {errors.licensePlate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.licensePlate}
                </p>
              )}
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
              {errors.vin && (
                <p className="text-red-500 text-sm mt-1">{errors.vin}</p>
              )}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create Vehicle
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default CreateVehicle;
