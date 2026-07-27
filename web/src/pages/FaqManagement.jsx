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

  const visibleFaqs = useMemo(() => {
    const filtered =
      categoryFilter === "All" ? faqs : faqs.filter((f) => f.category === categoryFilter);
    return [...filtered].sort((a, b) =>
      sortDirection === "asc"
        ? a.question_text.localeCompare(b.question_text)
        : b.question_text.localeCompare(a.question_text)
    );
  }, [faqs, categoryFilter, sortDirection]);

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
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">FAQs</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm text-navy placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setIsModalOpen(true);
            }}
            className="rounded-full border border-gold px-4 py-1.5 text-sm font-medium text-navy transition-colors hover:bg-gold hover:text-white"
          >
            Add FAQ
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
        <span className="text-sm font-semibold text-navy">Filters</span>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-gray-300 px-3 py-1 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          <option value="All">All Types</option>
          {CATEGORIES.map((category) => (
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
              <th className="px-4 py-3 font-semibold">FAQ</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleFaqs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">
                  No FAQs yet.
                </td>
              </tr>
            ) : (
              visibleFaqs.map((faq) => (
                <tr
                  key={faq.faq_id}
                  className="border-b border-gray-100 text-navy transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{faq.question_text}</td>
                  <td className="px-4 py-3">{faq.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => {
                          setEditingFaq(faq);
                          setIsModalOpen(true);
                        }}
                        aria-label="Edit FAQ"
                        className="text-gray-500 transition-colors hover:text-blue-600"
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
                        className="text-gray-500 transition-colors hover:text-red-500"
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