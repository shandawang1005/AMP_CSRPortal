import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClients, searchClients } from "../features/clients/clientsThunks";
import { Link, useNavigate } from "react-router-dom";

export default function ClientTable({ searchTerm, page, onPageChange }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clients, loading, error, pagination } = useSelector(
    (state) => state.clients
  );
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortField, setSortField] = useState("lastTicket");
  const limit = 10;
  useEffect(() => {
    if (searchTerm) {
      dispatch(searchClients({ term: searchTerm, page, limit }));
    } else {
      dispatch(fetchClients({ page, limit }));
    }
  }, [dispatch, searchTerm, page]);

  const clientList = clients?.data || [];
  const totalPages = pagination?.pages || 1;
  const totalClients = pagination?.total || 0;
  //frontend sorting logic
  const sortedClients = [...clientList].sort((a, b) => {
    const getVal = (client) => {
      if (sortField === "lastTicket") {
        const dates = client.tickets?.map((t) => new Date(t.createdAt)) || [];
        return dates.length ? Math.max(...dates.map((d) => d.getTime())) : 0;
      }
      if (sortField === "openTickets") {
        return client.tickets?.filter((t) => t.status !== "closed").length || 0;
      }
      if (sortField === "name") {
        return `${client.firstName} ${client.lastName}`.toLowerCase();
      }
      if (sortField === "email") {
        return client.email?.toLowerCase() || "";
      }
      if (sortField === "phone") {
        return client.phone || "";
      }
      return 0;
    };

    const valA = getVal(a);
    const valB = getVal(b);

    if (typeof valA === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      return sortOrder === "asc" ? valA - valB : valB - valA;
    }
  });
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clients</h2>

      {loading ? (
        <p>Loading clients...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    Name{" "}
                    {sortField === "name" ? (
                      sortOrder === "asc" ? (
                        "↑"
                      ) : (
                        "↓"
                      )
                    ) : (
                      <span className="text-gray-400">↑</span>
                    )}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    Email{" "}
                    {sortField === "email" ? (
                      sortOrder === "asc" ? (
                        "↑"
                      ) : (
                        "↓"
                      )
                    ) : (
                      <span className="text-gray-400">↑</span>
                    )}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("phone")}
                  >
                    Phone{" "}
                    {sortField === "phone" ? (
                      sortOrder === "asc" ? (
                        "↑"
                      ) : (
                        "↓"
                      )
                    ) : (
                      <span className="text-gray-400">↑</span>
                    )}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("lastTicket")}
                  >
                    Last Ticket Date{""}
                    {sortField === "lastTicket" ? (
                      sortOrder === "asc" ? (
                        "↑"
                      ) : (
                        "↓"
                      )
                    ) : (
                      <span className="text-gray-400">↑</span>
                    )}
                  </th>
                  <th
                    className="px-4 py-2 text-left cursor-pointer"
                    onClick={() => handleSort("openTickets")}
                  >
                    Open Tickets{""}
                    {sortField === "openTickets" ? (
                      sortOrder === "asc" ? (
                        "↑"
                      ) : (
                        "↓"
                      )
                    ) : (
                      <span className="text-gray-400">↑</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedClients.map((client) => (
                  <tr
                    key={client._id}
                    onClick={() => navigate(`/client/${client._id}`)}
                    className="border-t hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2">
                      {client.firstName} {client.lastName}
                    </td>
                    <td className="px-4 py-2">{client.email}</td>
                    <td className="px-4 py-2">{client.phone}</td>
                    <td className="px-4 py-2">
                      {client.tickets && client.tickets.length > 0
                        ? new Date(
                            client.tickets
                              .map((t) => new Date(t.createdAt))
                              .sort((a, b) => b - a)[0]
                          ).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-2">
                      {
                        client.tickets.filter(
                          (ticket) => ticket.status !== "closed"
                        ).length
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={() => onPageChange(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-gray-600">
              Page {page} of {totalPages} — Total: {totalClients}
            </span>

            <button
              onClick={() => onPageChange(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
