import { useEffect, useMemo, useState } from "react";
import { getInquiryLogs } from "../api/inquiryLogs.js";

export default function InquiryLogs() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [intentFilter, setIntentFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    getInquiryLogs()
      .then(setLogs)
      .catch(() => setError("Could not load inquiry logs."))
      .finally(() => setIsLoading(false));
  }, []);

  const intentOptions = useMemo(
    () => [...new Set(logs.map((log) => log.detected_intent))].sort(),
    [logs]
  );

  const filteredLogs = logs.filter((log) => {
    if (intentFilter && log.detected_intent !== intentFilter) return false;
    if (userFilter && String(log.user_id) !== userFilter.trim()) return false;

    const logDate = log.timestamp.slice(0, 10);
    if (dateFrom && logDate < dateFrom) return false;
    if (dateTo && logDate > dateTo) return false;

    return true;
  });

  const handleClearFilters = () => {
    setIntentFilter("");
    setUserFilter("");
    setDateFrom("");
    setDateTo("");
  };

  if (isLoading) return <p>Loading inquiry logs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-navy">Inquiry Logs</h3>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-500">Category (Intent)</label>
          <select
            value={intentFilter}
            onChange={(e) => setIntentFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="">All</option>
            {intentOptions.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-500">User ID</label>
          <input
            type="text"
            placeholder="e.g. 4"
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-500">From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-500">To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
          />
        </div>

        <button
          type="button"
          onClick={handleClearFilters}
          className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-navy"
        >
          Clear Filters
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-300">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 bg-navy text-sm text-white">
              <th className="px-4 py-3 font-semibold">User ID</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Intent</th>
              <th className="px-4 py-3 font-semibold">Escalated</th>
              <th className="px-4 py-3 font-semibold">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.log_id} className="border-b border-gray-200 text-navy last:border-0">
                <td className="px-4 py-3">#{log.user_id}</td>
                <td className="px-4 py-3">{log.user_message}</td>
                <td className="px-4 py-3">{log.detected_intent}</td>
                <td className="px-4 py-3">{log.is_escalated ? "Yes" : "No"}</td>
                <td className="px-4 py-3">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLogs.length === 0 && (
          <p className="p-4 text-center text-sm text-gray-500">No logs match your filters.</p>
        )}
      </div>
    </section>
  );
}