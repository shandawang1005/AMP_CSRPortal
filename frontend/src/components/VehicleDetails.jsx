import { useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditVehicle from "./EditVehicle";
import DeleteVehicle from "./DeleteVehicle";
import HistoryModal from "../components/HistoryModal";
import TransferSubscriptionModal from "./TransferSubscriptionModal";
import {
  fetchClientById,
  updateClientBalance,
} from "../features/clients/clientsThunks";
import { addWashHistory } from "../features/vehicles/vehiclesThunks";
const VehicleDetails = ({ vehicle, onUpdate, onDelete, selectedClient }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const updatedVehicle = useSelector((state) =>
    state.clients.selectedClient.vehicles.find((v) => v._id === vehicle._id)
  );
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");

  const handleHistoryModalOpen = () => {
    setIsHistoryModalOpen(true);
  };

  const handleHistoryModalClose = () => {
    setIsHistoryModalOpen(false);
  };
  const handleDeduct = async () => {
    if (amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    if (selectedClient.balance < amount) {
      setMessage("Insufficient balance.");
      return;
    }
    setMessage("Processing...");
    try {
      const numericAmount = parseFloat(amount);
      if (isNaN(numericAmount)) {
        setMessage("Amount should be a valid number.");
        return;
      }
      await dispatch(
        updateClientBalance({ clientId: id, amount: -numericAmount })
      );
      const historyData = {
        date: new Date(),
        service: "Basic Wash",
        price: -numericAmount, // Deduction is negative
      };

      await dispatch(
        addWashHistory({
          clientId: id,
          vehicleId: vehicle._id,
          historyData: historyData,
        })
      );
      await dispatch(fetchClientById(id));
      //Make it like actual calling deduction through Stripe or other 3rd party
      setTimeout(() => {
        setMessage(`Deduction of $${numericAmount} was successful.`);
      }, [1000]);
      //Remove message after deduction
      setTimeout(() => {
        setMessage("");
      }, [2000]);

      setAmount(0); // Reset the input field after deduction
    } catch (error) {
      console.error("Error processing deduction:", error);
      setMessage("Error processing deduction.");
    }
  };

  const sortedHistory = [...vehicle.washHistory].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA - dateB;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Make</th>
              <th className="px-4 py-2 text-left">Model</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">License Plate</th>
              <th className="px-4 py-2 text-left">Color</th>
              <th className="px-4 py-2 text-left">VIN</th>
              <th className="px-4 py-2 text-left">Subscription Method</th>
              <th className="px-4 py-2 text-left">Subscription Start</th>
              <th className="px-4 py-2 text-left">Subscription End</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.make}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.model}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.year}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.licensePlate}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.color}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {"*****" + updatedVehicle.vin.slice(-5)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.subscriptionType === "monthly"
                  ? "Monthly"
                  : "Pay Per Wash"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.subscriptionType === "monthly" &&
                vehicle.subscriptionStartDate
                  ? new Date(
                      updatedVehicle.subscriptionStartDate
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {updatedVehicle.subscriptionType === "monthly" &&
                vehicle.subscriptionEndDate
                  ? new Date(
                      updatedVehicle.subscriptionEndDate
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Buttons to edit, delete, transfer, and view history */}
      <div className="flex space-x-4">
        <EditVehicle
          vehicle={updatedVehicle}
          clientId={id}
          onUpdate={onUpdate}
        />
        <DeleteVehicle
          vehicleId={updatedVehicle._id}
          clientId={id}
          onDelete={onDelete}
        />
        {updatedVehicle.subscriptionType === "monthly" && (
          <button
            className="text-purple-600 font-medium px-6 py-2 ml-1"
            onClick={() => setIsTransferModalOpen(true)}
          >
            Transfer Subscription
          </button>
        )}
        <TransferSubscriptionModal
          isOpen={isTransferModalOpen}
          onClose={() => setIsTransferModalOpen(false)}
          currentVehicle={vehicle}
          clientVehicles={selectedClient.vehicles}
          clientId={id}
          onUpdate={onUpdate}
          onTransfer={() => dispatch(fetchClientById(id))}
        />
        <button
          className="text-green-600 font-medium px-6 py-2 ml-1"
          onClick={handleHistoryModalOpen}
        >
          View History
        </button>
      </div>

      {/* Deduct Amount Section */}
      {updatedVehicle.subscriptionType === "monthly" ? (
        <></>
      ) : (
        <div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter deduction amount"
            className="w-full p-2 border border-gray-300 rounded-md"
          />

          {/* Deduct Button */}
          <button
            onClick={handleDeduct}
            disabled={amount <= 0 || selectedClient.balance < amount}
            className={`w-full p-2 mt-4 rounded-md text-white ${
              amount <= 0 || selectedClient.balance < amount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Deduct
          </button>

          {/* Message Display */}
          {message && <p className="mt-4 text-center">{message}</p>}
        </div>
      )}

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={handleHistoryModalClose}
        washHistory={sortedHistory}
      />
    </div>
  );
};

export default VehicleDetails;
