const STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

const LABELS = {
  pending: "Unassigned",
  active: "Active",
  resolved: "Resolved",
};

export default function TicketStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        STYLES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}