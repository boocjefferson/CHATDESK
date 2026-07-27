import { Fragment, useEffect, useMemo, useState } from "react";
import { getTickets, updateTicket } from "../api/tickets.js";
import TicketStatusBadge from "../components/TicketStatusBadge.jsx";
import { ErrorState, LoadingState } from "../components/PageState.jsx";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortDirection, setSortDirection] = useState("asc");
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [answerDraft, setAnswerDraft] = useState("");
  const [isSending, setIsSending] = useState(false);

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

  const categories = useMemo(
    () => Array.from(new Set(tickets.map((t) => t.subject_category))).sort(),
    [tickets]
  );

  const visibleTickets = useMemo(() => {
    const filtered =
      categoryFilter === "All"
        ? tickets
        : tickets.filter((t) => t.subject_category === categoryFilter);
    return [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.subject_category.localeCompare(b.subject_category)
        : b.subject_category.localeCompare(a.subject_category)
    );
  }, [tickets, categoryFilter, sortDirection]);

  const handleToggleRow = (ticket) => {
    if (expandedTicketId === ticket.ticket_id) {
      setExpandedTicketId(null);
      return;
    }
    setExpandedTicketId(ticket.ticket_id);
    setAnswerDraft(ticket.resolution ?? "");
  };

  const handleSendAnswer = async (ticketId) => {
    const trimmed = answerDraft.trim();
    if (!trimmed || isSending) return;
    setIsSending(true);
    try {
      await updateTicket(ticketId, { resolution: trimmed, status: "resolved" });
      setExpandedTicketId(null);
      setAnswerDraft("");
      loadTickets();
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) return <LoadingState label="Loading tickets..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">Ticket</h3>
        <input
          type="text"
          placeholder="Search"
          className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-sm font-semibold text-navy">Filters</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="All">All Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy transition-colors hover:border-gold"
        >
          Sort: {sortDirection === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-navy text-sm text-white">
              <th className="px-4 py-3 font-semibold">User Question</th>
              <th className="px-4 py-3 font-semibold">From User</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleTickets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-gray-500">
                  No tickets yet.
                </td>
              </tr>
            ) : (
              visibleTickets.map((ticket) => (
                <Fragment key={ticket.ticket_id}>
                  <tr
                    onClick={() => handleToggleRow(ticket)}
                    className="cursor-pointer border-b border-gray-100 text-navy transition-colors last:border-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{ticket.issue_description}</td>
                    <td className="px-4 py-3">Student #{ticket.user_id}</td>
                    <td className="px-4 py-3">{ticket.subject_category}</td>
                    <td className="px-4 py-3 text-right">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                  </tr>
                  {expandedTicketId === ticket.ticket_id && (
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td colSpan={4} className="px-4 py-3">
                        <div
                          className="flex items-end gap-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <textarea
                            rows={2}
                            value={answerDraft}
                            onChange={(e) => setAnswerDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendAnswer(ticket.ticket_id);
                              }
                            }}
                            placeholder="State your answer..."
                            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
                          />
                          <button
                            type="button"
                            onClick={() => handleSendAnswer(ticket.ticket_id)}
                            disabled={!answerDraft.trim() || isSending}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold text-white transition-opacity hover:brightness-95 disabled:opacity-40"
                            aria-label="Send answer"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 20l16-8L4 4v6l10 2-10 2v6z" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}