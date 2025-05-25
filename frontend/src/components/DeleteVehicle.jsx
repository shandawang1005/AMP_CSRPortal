import { useState } from "react";
import { useDispatch } from "react-redux";
import Modal from "./Modal";
import { deleteVehicle } from "../features/vehicles/vehiclesThunks";

const DeleteVehicle = ({ vehicleId, clientId, onDelete }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {

      onDelete(vehicleId);
      setIsConfirming(false);
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      setIsConfirming(false);
    }
  };

  return (
    <>
      {/* Delete button */}
      <button
        className="text-red-600 font-medium px-6 py-2 ml-2"
        onClick={() => setIsConfirming(true)}
      >
        Delete
      </button>

      {/* Modal for confirming deletion */}
      {isConfirming && (
        <Modal
          isOpen={isConfirming}
          onClose={() => setIsConfirming(false)}
          title="Confirm Delete"
        >
          <div className="p-4">
            <p className="text-lg font-medium text-gray-700">
              Are you sure you want to delete this vehicle?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setIsConfirming(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
              >
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default DeleteVehicle;
