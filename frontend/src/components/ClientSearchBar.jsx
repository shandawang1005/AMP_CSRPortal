import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ClientSearchBar({ onSearch, onPageReset }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(term.trim());
    onPageReset();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by name, email or phone"
        className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}
