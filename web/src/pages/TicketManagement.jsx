// Placeholder view - matches ui-prototype/admin_ticket_board.png layout.
// Live data + inline reply wiring happens in Sprint 2
// (feature/ticket-escalation-logic, feature/web-ticket-board).
const placeholderTickets = [
  { id: 1, question: "Question 1", fromUser: "User Email 1", category: "Requirements" },
  { id: 2, question: "Question 2", fromUser: "User Email 2", category: "Event Schedule" },
  { id: 3, question: "Question 3", fromUser: "User Email 3", category: "Entrance Exam" },
];

export default function TicketManagement() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">Ticket</h3>
        <input
          type="text"
          placeholder="Search"
          disabled
          className="rounded-full border border-gray-400 px-4 py-1 text-sm"
        />
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3">
        <span className="font-medium">Filters</span>
        <span className="rounded-full border border-gray-400 px-3 py-1 text-sm">All Category</span>
        <span className="ml-auto rounded-full border border-gray-400 px-3 py-1 text-sm">Sort: A-Z</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-300">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 text-sm text-gray-600">
              <th className="px-4 py-3">User Question</th>
              <th className="px-4 py-3">From User</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {placeholderTickets.map((ticket) => (
              <tr key={ticket.id} className="border-b border-gray-200 last:border-0">
                <td className="px-4 py-3">{ticket.question}</td>
                <td className="px-4 py-3">{ticket.fromUser}</td>
                <td className="px-4 py-3">{ticket.category}</td>
                <td className="px-4 py-3 text-right text-gray-400">Coming soon</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Live ticket data lands in Sprint 2 (GET/PATCH /api/v1/tickets/ per API_CONTRACT.md).
      </p>
    </section>
  );
}
