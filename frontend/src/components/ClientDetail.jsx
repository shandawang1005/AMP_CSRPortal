import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchClientById,
  updateClient,
  refillBalance,
} from "../features/clients/clientsThunks";
import {
  deleteVehicle,
  updateVehicle,
} from "../features/vehicles/vehiclesThunks";
import VehicleDetails from "./VehicleDetails";
import CreateVehicle from "./CreateVehicle";
import ContactInfoModal from "../components/ContactInfoModal";
import AccountStatus from "./AccountStatus";
import AddTicketModal from "./AddTicketModal";

export default function ClientDetail() {
  const { id } = useParams();
  const [showContactModal, setShowContactModal] = useState(false);

  const dispatch = useDispatch();
  const { selectedClient, loading, error } = useSelector(
    (state) => state.clients
  );

  useEffect(() => {
    dispatch(fetchClientById(id));
  }, [dispatch, id]);

  const handleSubmit = (updatedData) => {
    dispatch(updateClient({ id, updateData: updatedData })).then((res) => {
      if (!res.error) {
        dispatch(fetchClientById(id));
        setShowContactModal(false);
      }
    });
  };

  const handleVehicleCreated = () => {
    dispatch(fetchClientById(id));
  };
  const handleTicketCreated = () => {
    dispatch(fetchClientById(id));
  };
  const handleUpdateVehicle = (vehicleId, updatedData) => {
    dispatch(updateVehicle({ clientId: id, vehicleId, updatedData }));
    dispatch(fetchClientById(id));
  };

  const handleDeleteVehicle = (vehicleId) => {
    dispatch(deleteVehicle({ clientId: id, vehicleId }));
    dispatch(fetchClientById(id));
  };
  const handleRecharge = (amount) => {
    dispatch(refillBalance({ clientId: id, amount: amount })).then((res) => {
      if (res.payload) {
        dispatch(fetchClientById(id));
      }
    });
  };

  if (loading) return <p>Loading client data...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!selectedClient) return <p>No client found.</p>;

  const { firstName, lastName, email, phone, address, tickets, vehicles } =
    selectedClient;

  return (
    <>
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          {firstName} {lastName}
        </h2>

        {/* Contact Info Section */}
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold mb-2">Contact Info</h3>
            <button
              className="text-blue-600 font-medium"
              onClick={() => setShowContactModal(true)}
            >
              Edit
            </button>
          </div>
          <div className="flex justify-between items-center mb-4">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Phone</th>
                  <th className="px-4 py-2 text-left">Address</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2">{email}</td>
                  <td className="px-4 py-2">{phone}</td>
                  <td className="px-4 py-2">{address}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Account Status Section */}
        <AccountStatus
          selectedClient={selectedClient}
          onRecharge={handleRecharge}
        />

        {/* Vehicles Section */}
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold mb-2">
              Vehicles ( To test deduction per car wash, please update the
              Subscription Method to Pay Per Wash under edit. )
            </h3>
            <CreateVehicle
              clientId={selectedClient._id}
              onVehicleCreated={handleVehicleCreated}
            />
          </div>

          {vehicles?.length > 0 ? (
            vehicles.map((v) => (
              <VehicleDetails
                key={v._id}
                vehicle={v}
                onUpdate={handleUpdateVehicle}
                selectedClient={selectedClient}
                onDelete={handleDeleteVehicle}
              />
            ))
          ) : (
            <div className="px-4 py-2 text-center">No vehicles found.</div>
          )}
        </div>

        {/* Tickets Section */}
        <div className="mb-6 p-4 bg-white shadow-md rounded-lg">
          <h3 className="text-xl font-semibold mb-2">Tickets</h3>
          <AddTicketModal
            clientId={selectedClient._id}
            onTicketCreated={handleTicketCreated}
          />
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Subject</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets?.length > 0 ? (
                tickets.map((t) => (
                  <tr key={t._id}>
                    <td className="px-4 py-2">
                      <Link
                        to={`/tickets/${t._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {t.subject}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{t.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="px-4 py-2 text-center">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contact Info Modal */}
      <ContactInfoModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        initialData={{
          firstName,
          lastName,
          email,
          phone,
          address,
        }}
        onSubmit={handleSubmit}
      />
    </>
  );
}
