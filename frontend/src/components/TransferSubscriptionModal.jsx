import { useState } from "react";
import Modal from "./Modal";
import { useDispatch } from "react-redux";
import { addWashHistory } from "../features/vehicles/vehiclesThunks";

export default function TransferSubscriptionModal({
  isOpen,
  onClose,
  currentVehicle,
  clientVehicles,
  clientId,
  onUpdate,
  onTransfer,
}) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleTransfer = async (targetVehicleId) => {
    try {
      setLoading(true);
      const now = new Date();
      const {
        subscriptionType,
        subscriptionStartDate,
        subscriptionEndDate,
        subscriptionAmount,
      } = { ...currentVehicle };

      if (!subscriptionStartDate || !subscriptionEndDate) {
        throw new Error("Current vehicle has no valid subscription date!");
      }
      await onUpdate(targetVehicleId, {
        subscriptionType: "monthly",
        subscriptionStartDate: subscriptionStartDate,
        subscriptionEndDate: subscriptionEndDate,
        subscriptionAmount: subscriptionAmount,
      });
      await onUpdate(currentVehicle._id, {
        subscriptionType: "payPerWash",
        subscriptionStartDate: null,
        subscriptionEndDate: null,
        subscriptionAmount: null,
      });

      await dispatch(
        addWashHistory({
          clientId,
          vehicleId: targetVehicleId,
          historyData: {
            date: now,
            service: "Subscription Transferred",
            price: 0,
            orderNumber: `${now.getFullYear()}${(now.getMonth() + 1)
              .toString()
              .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${
              Math.floor(Math.random() * 9000) + 1000
            }`,
          },
        })
      );
      onClose();
      if (onTransfer) onTransfer();
    } catch (err) {
      console.error("Error during transfer:", err);
    } finally {
      setLoading(false);
    }
  };
  //Only supporting clientVehicle to transfer sub from monthly to payperwash, not switching monthly sub
  const eligibleVehicles = clientVehicles.filter(
    (v) => v._id !== currentVehicle._id && v.subscriptionType !== "monthly"
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">Transfer Subscription To:</h2>
      {eligibleVehicles.length === 0 ? (
        <p>No other vehicles available for transfer.</p>
      ) : (
        eligibleVehicles.map((v) => (
          <button
            key={v._id}
            onClick={() => handleTransfer(v._id)}
            disabled={loading}
            className="block w-full text-left border p-2 mb-2 rounded hover:bg-gray-100"
          >
            {v.make} {v.model} ({v.licensePlate})
          </button>
        ))
      )}
      {loading && <p className="mt-2 text-sm text-gray-600">Transferring...</p>}
    </Modal>
  );
}
