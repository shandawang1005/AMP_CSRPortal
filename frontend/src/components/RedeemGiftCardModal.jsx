import { useState } from "react";
import Modal from "./Modal";

const RedeemGiftCardModal = ({ isOpen, onClose, onRecharge }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const handleRecharge = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!cardNumber.trim()) {
      newErrors.cardNumber = "Gift card number is required.";
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      newErrors.amount = "Enter a valid amount greater than 0.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus("Processing...");

    setTimeout(() => {
      onRecharge(numericAmount);
      setCardNumber("");
      setAmount("");
      setStatus("");
      onClose();
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Redeem Balance</h2>

      {/* Card number input */}
      <label className="block text-sm font-medium text-gray-700">
        Gift Card Number
      </label>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => {
          setCardNumber(e.target.value);
          setErrors({});
        }}
        placeholder="Enter card number"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
      />
      {errors.cardNumber && (
        <p className="text-red-500 text-sm mb-3">{errors.cardNumber}</p>
      )}

      {/* Amount input */}
      <label className="block text-sm font-medium text-gray-700">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setErrors({});
        }}
        placeholder="Enter amount"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
        step="0.01"
      />
      {errors.amount && (
        <p className="text-red-500 text-sm mb-3">{errors.amount}</p>
      )}

      {/* Submit button */}
      <button
        onClick={handleRecharge}
        className="w-full bg-green-600 text-white py-2 rounded mb-4 hover:bg-green-700"
      >
        Submit
      </button>

      {/* Cancel button */}
      <button
        onClick={onClose}
        className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
      >
        Cancel
      </button>

      {status && <p className="mt-4 text-center text-gray-700">{status}</p>}
    </Modal>
  );
};

export default RedeemGiftCardModal;
