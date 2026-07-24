import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../api/analytics.js";
import { ErrorState, LoadingState } from "../components/PageState.jsx";

const STATUS_META = {
  pending: { label: "Pending", color: "#B45309" },
  active: { label: "Active", color: "#2563EB" },
  resolved: { label: "Resolved", color: "#16A34A" },
};

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsOverview()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState label="Loading analytics..." />;
  if (!data) return <ErrorState message="Could not load analytics." />;

  const totalTickets = Object.values(data.tickets_by_status).reduce((sum, count) => sum + count, 0);
  const resolvedTickets = data.tickets_by_status.resolved ?? 0;

  return (
    <section>
      <h3 className="mb-5 text-lg font-bold text-navy">Analytics Overview</h3>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total inquiries" value={data.total_inquiries} />
        <StatTile label="Total tickets" value={totalTickets} />
        <StatTile label="Resolved tickets" value={resolvedTickets} />
        <StatTile label="Resolution rate" value={`${Math.round(data.resolution_rate * 100)}%`} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-3">
          <h4 className="mb-5 font-semibold text-navy">Intent Frequency</h4>
          <IntentFrequencyChart items={data.intent_frequencies} />
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h4 className="mb-5 font-semibold text-navy">Tickets by Status</h4>
          <TicketStatusDonut counts={data.tickets_by_status} total={totalTickets} />
        </div>
      </div>
    </section>
  );
}

function StatTile({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-navy">{value}</p>
    </div>
  );
}

function humanizeIntent(intent) {
  return intent
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function IntentFrequencyChart({ items }) {
  if (!items || items.length === 0) {
    return <p className="py-8 text-center text-sm text-gray-500">No inquiries logged yet.</p>;
  }

  const maxCount = Math.max(...items.map((item) => item.count));

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const widthPct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        return (
          <div key={item.intent} className="group">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-navy">{humanizeIntent(item.intent)}</span>
              <span className="font-semibold tabular-nums text-navy">{item.count}</span>
            </div>
            <div
              className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100"
              title={`${humanizeIntent(item.intent)}: ${item.count} inquiries`}
            >
              <div
                className="h-full rounded-full bg-navy transition-[filter] duration-150 group-hover:brightness-125"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TicketStatusDonut({ counts, total }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const gap = total > 0 ? 3 : 0;
  const [hovered, setHovered] = useState(null);

  const statuses = Object.keys(STATUS_META);
  let cumulative = 0;
  const segments = statuses.map((key) => {
    const count = counts[key] ?? 0;
    const rawLength = total > 0 ? (count / total) * circumference : 0;
    const length = Math.max(rawLength - gap, 0);
    const segment = { key, count, length, offset: cumulative };
    cumulative += rawLength;
    return segment;
  });

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-center">
      <div className="relative h-40 w-40 shrink-0">
        {total === 0 ? (
          <svg viewBox="0 0 120 120" className="h-full w-full">
            <circle cx="60" cy="60" r={radius} fill="none" stroke="#F3F4F6" strokeWidth="14" />
          </svg>
        ) : (
          <svg viewBox="0 0 120 120" className="h-full w-full">
            {segments.map((segment) => (
              <circle
                key={segment.key}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={STATUS_META[segment.key].color}
                strokeWidth={hovered === segment.key ? 17 : 14}
                strokeDasharray={`${segment.length} ${circumference - segment.length}`}
                strokeDashoffset={-segment.offset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className="cursor-default transition-[stroke-width] duration-150"
                tabIndex={0}
                role="img"
                aria-label={`${STATUS_META[segment.key].label}: ${segment.count} tickets`}
                onMouseEnter={() => setHovered(segment.key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(segment.key)}
                onBlur={() => setHovered(null)}
              />
            ))}
          </svg>
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold text-navy">{total}</span>
          <span className="text-xs text-gray-500">Tickets</span>
        </div>
      </div>

      <div className="w-full max-w-[220px] space-y-2.5">
        {statuses.map((key) => {
          const meta = STATUS_META[key];
          const count = counts[key] ?? 0;
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div
              key={key}
              className={`flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition-colors ${
                hovered === key ? "bg-gray-50" : ""
              }`}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
            >
              <span className="flex items-center gap-2 text-navy">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                {meta.label}
              </span>
              <span className="tabular-nums text-gray-500">
                <span className="font-semibold text-navy">{count}</span> ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
