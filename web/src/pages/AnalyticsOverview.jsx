import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../api/analytics.js";

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAnalyticsOverview()
      .then(setData)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p>Loading analytics...</p>;
  if (!data) return <p className="text-red-500">Could not load analytics.</p>;

  const maxCount = Math.max(...data.intent_frequencies.map((i) => i.count));
  const totalTickets = Object.values(data.tickets_by_status).reduce((sum, count) => sum + count, 0);
  const resolvedTickets = data.tickets_by_status.resolved ?? 0;

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-navy">Analytics Overview</h3>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Inquiries" value={data.total_inquiries} />
        <StatCard label="Total Tickets" value={totalTickets} />
        <StatCard label="Resolved Tickets" value={resolvedTickets} />
        <StatCard
          label="Resolution Rate"
          value={`${Math.round(data.resolution_rate * 100)}%`}
        />
      </div>

      <div className="rounded-2xl border border-gray-300 p-6">
        <h4 className="mb-4 font-semibold text-navy">Intent Frequency</h4>
        <div className="space-y-3">
          {data.intent_frequencies.map((item) => (
            <div key={item.intent}>
              <div className="mb-1 flex justify-between text-sm text-navy">
                <span>{item.intent}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gold"
                  style={{ width: `${(item.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-300 p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-navy">{value}</p>
    </div>
  );
}