import { Fragment, useEffect, useMemo, useState } from "react";
import { getTickets, updateTicket } from "../api/tickets.js";
import TicketStatusBadge from "../components/TicketStatusBadge.jsx";
import { ErrorState, LoadingState } from "../components/PageState.jsx";

export default function TicketManagement() {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
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

  const pendingCount = useMemo(() => tickets.filter((t) => t.status === "pending").length, [tickets]);
  const resolvedCount = useMemo(() => tickets.filter((t) => t.status === "resolved").length, [tickets]);

  const visibleTickets = useMemo(() => {
    const bySearch = search
      ? tickets.filter((t) => t.issue_description.toLowerCase().includes(search.toLowerCase()))
      : tickets;
    const filtered =
      categoryFilter === "All"
        ? bySearch
        : bySearch.filter((t) => t.subject_category === categoryFilter);
    return [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.subject_category.localeCompare(b.subject_category)
        : b.subject_category.localeCompare(a.subject_category)
    );
  }, [tickets, search, categoryFilter, sortDirection]);

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
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          label="Total Tickets"
          value={tickets.length}
          accentClass="bg-navy/10 text-navy"
          icon={
            <path
              d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 6v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-6V7Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          }
        />
        <StatTile
          label="Pending"
          value={pendingCount}
          accentClass="bg-status-pending/15 text-status-pending"
          icon={
            <path
              d="M12 8v4l3 3M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          }
        />
        <StatTile
          label="Resolved"
          value={resolvedCount}
          accentClass="bg-status-resolved/15 text-status-resolved"
          icon={
            <path
              d="m20 6-11 11-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="mr-auto text-lg font-bold text-navy">All Tickets</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          className="rounded-full border border-gray-200 px-4 py-1.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="All">All Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
          className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-navy transition-colors hover:border-gold"
        >
          Sort: {sortDirection === "asc" ? "A-Z" : "Z-A"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Question</th>
              <th className="px-5 py-3">From</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {visibleTickets.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-14 text-center text-sm text-gray-500">
                  No tickets yet.
                </td>
              </tr>
            ) : (
              visibleTickets.map((ticket) => (
                <Fragment key={ticket.ticket_id}>
                  <tr
                    onClick={() => handleToggleRow(ticket)}
                    className="cursor-pointer border-b border-gray-50 text-navy transition-colors last:border-0 hover:bg-gray-50/80"
                  >
                    <td className="max-w-md px-5 py-3.5 truncate">{ticket.issue_description}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy">
                          #{ticket.user_id}
                        </div>
                        <span className="text-gray-500">Student</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{ticket.subject_category}</td>
                    <td className="px-5 py-3.5 text-right">
                      <TicketStatusBadge status={ticket.status} />
                    </td>
                  </tr>
                  {expandedTicketId === ticket.ticket_id && (
                    <tr className="border-b border-gray-50 bg-gray-50/60">
                      <td colSpan={4} className="px-5 py-3">
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
                            className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
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

function StatTile({ label, value, icon, accentClass }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${accentClass}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          {icon}
        </svg>
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums text-navy">{value}</p>
    </div>
  );
}
