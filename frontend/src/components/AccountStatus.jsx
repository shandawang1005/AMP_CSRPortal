import { useState } from "react";
import RefillBalanceModal from "./RefillBalanceModal";
import RedeemGiftCardModal from "./RedeemGiftCardModal";

const AccountStatus = ({ selectedClient, onRecharge }) => {
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-2">Account Status</h3>
      <div className="flex justify-between items-center mb-4">
        <p
          className={`text-lg font-medium ${
            selectedClient.status === "overdue"
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {selectedClient.status === "overdue"
            ? "Overdue (Recharge Needed)"
            : "Active"}
        </p>
        <div
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            selectedClient.status === "overdue"
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {selectedClient.status === "overdue" ? "Overdue" : "Active"}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-lg font-medium">
          Account Balance:{" "}
          <span
            className={`${
              selectedClient.balance < 0 ? "text-red-600" : "text-black"
            } font-bold`}
          >
            ${selectedClient.balance.toFixed(2)}
          </span>
        </p>

        {selectedClient.status && (
          <>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
              onClick={() => openModal("refill")}
            >
              Refill Balance
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4 ml-2"
              onClick={() => openModal("giftcard")}
            >
              Redeem Gift Card
            </button>
          </>
        )}
      </div>
      {/* Refill Balance Modal */}
      <RefillBalanceModal
        isOpen={activeModal === "refill"}
        onClose={closeModal}
        onRecharge={onRecharge}
      />
      <RedeemGiftCardModal
        isOpen={activeModal === "giftcard"}
        onClose={closeModal}
        onRecharge={onRecharge}
      />
      
    </div>
  );
};

export default AccountStatus;
