import { useState } from "react";
import Modal from "./Modal";

const RefillBalanceModal = ({ isOpen, onClose, onRecharge }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!cardNumber.trim()) newErrors.cardNumber = "Card number is required.";
    if (!billingAddress.trim()) newErrors.billingAddress = "Billing address is required.";

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0)
      newErrors.amount = "Enter a valid amount greater than 0.";

    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      newErrors.expiry = "Enter expiry as MM/YY";
    } else {
      const [mm, yy] = expiry.split("/").map(Number);
      if (mm < 1 || mm > 12) {
        newErrors.expiry = "Month must be 01-12";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecharge = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const numericAmount = parseFloat(amount);
    setStatus("Processing...");

    setTimeout(() => {
      onRecharge(numericAmount);
      setCardNumber("");
      setAmount("");
      setBillingAddress("");
      setExpiry("");
      setStatus("");
      setErrors({});
      onClose();
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

    if (rawDigits.length > 4) rawDigits = rawDigits.slice(0, 4);

    let formattedValue = "";
    if (rawDigits.length === 0) formattedValue = "";
    else if (rawDigits.length <= 1) formattedValue = rawDigits;
    else if (rawDigits.length === 2) formattedValue = rawDigits + "/";
    else formattedValue = rawDigits.slice(0, 2) + "/" + rawDigits.slice(2);

    setExpiry(formattedValue);
    setErrors((prev) => ({ ...prev, expiry: null }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Recharge Balance</h2>

      <label className="block text-sm font-medium text-gray-700">Card Number</label>
      <input
        type="text"
        value={cardNumber}
        onChange={(e) => {
          setCardNumber(e.target.value);
          setErrors((prev) => ({ ...prev, cardNumber: null }));
        }}
        placeholder="Enter card number"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
      />
      {errors.cardNumber && <p className="text-red-500 text-sm mb-3">{errors.cardNumber}</p>}

      <label className="block text-sm font-medium text-gray-700">Expiry Date (MM/YY)</label>
      <input
        type="text"
        value={expiry}
        onChange={handleExpiryDateChange}
        placeholder="MM/YY"
        maxLength={5}
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
      />
      {errors.expiry && <p className="text-red-500 text-sm mb-3">{errors.expiry}</p>}

      <label className="block text-sm font-medium text-gray-700">Billing Address</label>
      <input
        type="text"
        value={billingAddress}
        onChange={(e) => {
          setBillingAddress(e.target.value);
          setErrors((prev) => ({ ...prev, billingAddress: null }));
        }}
        placeholder="Enter billing address"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
      />
      {errors.billingAddress && <p className="text-red-500 text-sm mb-3">{errors.billingAddress}</p>}

      <label className="block text-sm font-medium text-gray-700">Amount</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setErrors((prev) => ({ ...prev, amount: null }));
        }}
        placeholder="Enter amount"
        className="w-full border border-gray-300 rounded px-3 py-2 mb-1"
        step="0.01"
      />
      {errors.amount && <p className="text-red-500 text-sm mb-3">{errors.amount}</p>}

      <button
        onClick={handleRecharge}
        className="w-full bg-green-600 text-white py-2 rounded mb-4 hover:bg-green-700"
      >
        Submit
      </button>

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

export default RefillBalanceModal;
