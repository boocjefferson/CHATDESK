import { useEffect, useMemo, useState } from "react";
import { createFaq, deleteFaq, getFaqs, updateFaq } from "../api/faqs.js";
import FaqFormModal, { CATEGORIES } from "../components/FaqFormModal.jsx";
import { ErrorState, LoadingState } from "../components/PageState.jsx";

export default function FaqManagement() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortDirection, setSortDirection] = useState("asc");

  const loadFaqs = () => {
    setIsLoading(true);
    getFaqs()
      .then((res) => setFaqs(res.data.results ?? res.data))
      .catch(() => setError("Could not load FAQs."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const categoriesInUse = useMemo(
    () => new Set(faqs.map((f) => f.category)).size,
    [faqs]
  );

  const visibleFaqs = useMemo(() => {
    const bySearch = search
      ? faqs.filter((f) => f.question_text.toLowerCase().includes(search.toLowerCase()))
      : faqs;
    const filtered =
      categoryFilter === "All" ? bySearch : bySearch.filter((f) => f.category === categoryFilter);
    return [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.question_text.localeCompare(b.question_text)
        : b.question_text.localeCompare(a.question_text)
    );
  }, [faqs, search, categoryFilter, sortDirection]);

  const handleDelete = async (faqId) => {
    if (!window.confirm("Delete this FAQ?")) return;
    await deleteFaq(faqId);
    loadFaqs();
  };
  const handleSave = async (payload) => {
    if (editingFaq) {
      await updateFaq(editingFaq.faq_id, payload);
    } else {
      await createFaq(payload);
    }
    loadFaqs();
  };

  if (isLoading) return <LoadingState label="Loading FAQs..." />;
  if (error) return <ErrorState message={error} />;

  return (
    <section>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatTile
          label="Total FAQs"
          value={faqs.length}
          accentClass="bg-navy/10 text-navy"
          icon={
            <path
              d="M9 9a3 3 0 1 1 4 2.83c-.6.25-1 .85-1 1.5V14M12 17.5h.01M4 5h16a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8l-4 3V6a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          }
        />
        <StatTile
          label="Categories in Use"
          value={categoriesInUse}
          accentClass="bg-gold/15 text-gold"
          icon={
            <path
              d="M4 6h16M4 12h16M4 18h7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          }
        />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h3 className="mr-auto text-lg font-bold text-navy">All FAQs</h3>
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
          <option value="All">All Types</option>
          {CATEGORIES.map((category) => (
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
        <button
          type="button"
          onClick={() => {
            setEditingFaq(null);
            setIsModalOpen(true);
          }}
          className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:brightness-95"
        >
          + Add FAQ
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-5 py-3">Question</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleFaqs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-14 text-center text-sm text-gray-500">
                  No FAQs yet.
                </td>
              </tr>
            ) : (
              visibleFaqs.map((faq) => (
                <tr
                  key={faq.faq_id}
                  className="border-b border-gray-50 text-navy transition-colors last:border-0 hover:bg-gray-50/80"
                >
                  <td className="px-5 py-3.5">{faq.question_text}</td>
                  <td className="px-5 py-3.5">
                    <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium text-navy">
                      {faq.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsModalOpen(true);
                        }}
                        aria-label="Edit FAQ"
                        className="text-gray-400 transition-colors hover:text-status-active"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M4 20h4l10.5-10.5a2 2 0 0 0 0-2.83l-1.17-1.17a2 2 0 0 0-2.83 0L4 16v4z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinejoin="round"
                          />
                          <path d="M13.5 6.5l4 4" stroke="currentColor" strokeWidth="1.8" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(faq.faq_id)}
                        aria-label="Delete FAQ"
                        className="text-gray-400 transition-colors hover:text-red-500"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2m-7 0 1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <FaqFormModal
          initialFaq={editingFaq}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
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
