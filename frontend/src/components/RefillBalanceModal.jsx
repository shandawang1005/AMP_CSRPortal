import { useState } from "react";
import Modal from "./Modal";

const RefillBalanceModal = ({ isOpen, onClose, onRecharge }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState(0);
  const [expiry, setExpiry] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const handleRecharge = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }
    if (!cardNumber || !expiry || !billingAddress) {
      setMessage("Please fill in all fields.");
      return;
    }

    const numericAmount = parseFloat(amount);
    setStatus("Processing...");

    //This is fake refilling balance
    setTimeout(() => {
      setMessage(`Recharge of $${numericAmount} was successful.`);
      onRecharge(numericAmount);
      onClose();

      setCardNumber("");
      setAmount(0);
      setBillingAddress("");
      setExpiry("");
      setStatus("");
    }, 2000);
  };

  const handleExpiryDateChange = (e) => {
    const inputValue = e.target.value; 
    const oldValue = expiry; 

    let rawDigits = inputValue.replace(/[^0-9]/g, ""); 
    const oldDigits = oldValue.replace(/[^0-9]/g, ""); 
    if (oldValue.includes("/") && !inputValue.includes("/")) {
      if (oldValue.replace("/", "") === inputValue) {
        const slashIndex = oldValue.indexOf("/");
        if (slashIndex > 0) {
          const removeIndex = slashIndex - 1;
          rawDigits =
            oldDigits.slice(0, removeIndex) + oldDigits.slice(removeIndex + 1);
        }
      }
    }
    if (rawDigits.length > 4) {
      rawDigits = rawDigits.slice(0, 4);
    }

    let formattedValue = "";
    if (rawDigits.length === 0) {
      formattedValue = "";
    } else if (rawDigits.length <= 1) {
      formattedValue = rawDigits;
    } else if (rawDigits.length === 2) {
      formattedValue = rawDigits + "/";
    } else {
      formattedValue = rawDigits.slice(0, 2) + "/" + rawDigits.slice(2);
    }
    setExpiry(formattedValue);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Recharge Balance</h2>

      {/* Card number input */}
      <label className="block text-sm font-medium text-gray-700">
        Card Number
      </label>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Enter card number"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      {/* Expiry Date input */}
      <label className="block text-sm font-medium text-gray-700">
        Expiry Date (MM/YY)
      </label>
      <input
        type="text"
        value={expiry}
        onChange={handleExpiryDateChange}
        placeholder="Enter expiry date (MM/YY)"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        maxLength={5}
      />

      {/* Billing Address input */}
      <label className="block text-sm font-medium text-gray-700">
        Billing Address
      </label>
      <input
        type="text"
        value={billingAddress}
        onChange={(e) => setBillingAddress(e.target.value)}
        placeholder="Enter billing address"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

      {/* Amount input */}
      <label className="block text-sm font-medium text-gray-700">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
      />

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

      {status && <p className="mt-4 text-center">{status}</p>}
      {message && <p className="mt-4 text-center">{message}</p>}
    </Modal>
  );
};

export default RefillBalanceModal;
