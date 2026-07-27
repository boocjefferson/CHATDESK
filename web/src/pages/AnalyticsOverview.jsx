import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getAnalyticsOverview } from "../api/analytics.js";

export default function AnalyticsOverview() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    const params = {};
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;

    getAnalyticsOverview(params)
      .then(setData)
      .catch(() => setError("Could not load analytics."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    loadData();
  };

  const handleClearFilter = () => {
    setDateFrom("");
    setDateTo("");
    setTimeout(loadData, 0);
  };

  if (isLoading) return <p>Loading analytics...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!data) return null;

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-navy">Analytics Overview</h3>

      <form onSubmit={handleApplyFilter} className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-navy px-4 py-1.5 text-sm text-white"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={handleClearFilter}
          className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-navy"
        >
          Clear
        </button>
      </form>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Inquiries" value={data.total_inquiries} />
        <StatCard label="Total Escalations" value={data.total_escalations} />
        <StatCard
          label="Resolution Rate"
          value={`${Math.round(data.resolution_rate * 100)}%`}
        />
        <StatCard
          label="Open Tickets"
          value={
            (data.tickets_by_status?.pending ?? 0) +
            (data.tickets_by_status?.active ?? 0)
          }
        />
      </div>

      <div className="mb-6 rounded-2xl border border-gray-300 p-6">
        <h4 className="mb-4 font-semibold text-navy">Intent Frequency</h4>
        {data.intent_frequencies.length === 0 ? (
          <p className="text-sm text-gray-500">No data for this date range.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.intent_frequencies}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="intent" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#D4A017" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="rounded-2xl border border-gray-300 p-6">
        <h4 className="mb-4 font-semibold text-navy">Tickets by Status</h4>
        <div className="flex gap-6">
          {Object.entries(data.tickets_by_status ?? {}).map(([status, count]) => (
            <div key={status}>
              <p className="text-sm capitalize text-gray-500">{status}</p>
              <p className="text-2xl font-bold text-navy">{count}</p>
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