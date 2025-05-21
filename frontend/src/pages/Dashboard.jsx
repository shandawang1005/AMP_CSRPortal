import ClientSearchBar from "../components/ClientSearchBar";
import ClientsList from "../components/ClientsList";
import { useState } from "react";
export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Customer Service Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <ClientSearchBar
            onSearch={setSearchTerm}
            onPageReset={() => setPage(1)}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <ClientsList
            searchTerm={searchTerm}
            page={page}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
