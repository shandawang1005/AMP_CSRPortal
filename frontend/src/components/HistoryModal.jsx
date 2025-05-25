import { useState } from "react";
import Modal from "../components/Modal";

const HistoryModal = ({ isOpen, onClose, washHistory }) => {
  const [sortByDate, setSortByDate] = useState(false); // true for ascending, false for descending(new to old)

  const handleSortToggle = () => {
    setSortByDate(!sortByDate);
  };

  const sortedHistory = [...washHistory].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortByDate ? dateA - dateB : dateB - dateA;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Wash History</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th
              className="px-4 py-2 text-left cursor-pointer"
              onClick={handleSortToggle}
            >
              Date {sortByDate ? "↑" : "↓"}
            </th>
            <th className="px-4 py-2 text-left">Service</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((history, index) => (
            <tr key={index}>
              <td className="px-4 py-2">
                {new Date(history.date).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{history.service}</td>
              <td className="px-4 py-2">
                {/* Now hard code to 7$ for each wash for every type */}
                {history.price ? `$${history.price}` : "Monthly"}
              </td>
              <td className="px-4 py-2">
                {history.price ? (
                  <a
                    href={history.invoiceUrl} // This is blank Fake link for downloading file if S3 is linked. We can also have an attri caled InvoiceUrl in DB
                    className="text-blue-600 font-medium cursor-pointer"
                    download
                  >
                    View Invoice
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
};

export default HistoryModal;
