import { useEffect, useState } from "react";
import { getTickets, updateTicket } from "../api/tickets.js";
import TicketStatusBadge from "../components/TicketStatusBadge.jsx";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTickets = () => {
    setIsLoading(true);
    getTickets()
      .then((res) => setTickets(res.data.results ?? res.data))
      .catch(() => setError("Could not load tickets."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleClaim = async (ticketId) => {
    await updateTicket(ticketId, { status: "active" });
    loadTickets();
  };

  const handleResolve = async (ticketId) => {
    await updateTicket(ticketId, { status: "resolved" });
    loadTickets();
  };

  if (isLoading) return <p>Loading tickets...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">Ticket</h3>
        <input
          type="text"
          placeholder="Search"
          className="rounded-full border border-gray-300 px-4 py-1 text-sm text-navy placeholder:text-gray-400"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-300">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 bg-navy text-sm text-white">
              <th className="px-4 py-3 font-semibold">User Question</th>
              <th className="px-4 py-3 font-semibold">From User</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.ticket_id} className="border-b border-gray-200 text-navy last:border-0">
                <td className="px-4 py-3">{ticket.issue_description}</td>
                <td className="px-4 py-3">Student #{ticket.user_id}</td>
                <td className="px-4 py-3">{ticket.subject_category}</td>
                <td className="px-4 py-3">
                  <TicketStatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  {ticket.status === "pending" && (
                    <button onClick={() => handleClaim(ticket.ticket_id)} className="mr-3 text-blue-600">
                      Claim
                    </button>
                  )}
                  {ticket.status === "active" && (
                    <button onClick={() => handleResolve(ticket.ticket_id)} className="text-green-600">
                      Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}