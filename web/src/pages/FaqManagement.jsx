import { useEffect, useState } from "react";
import { createFaq, deleteFaq, getFaqs, updateFaq } from "../api/faqs.js";
import FaqFormModal from "../components/FaqFormModal.jsx";
import { ErrorState, LoadingState } from "../components/PageState.jsx";

export default function FaqManagement() {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);

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
            {faqs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-sm text-gray-500">
                  No FAQs yet.
                </td>
              </tr>
            ) : (
              faqs.map((faq) => (
                <tr
                  key={faq.faq_id}
                  className="border-b border-gray-100 text-navy transition-colors last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{faq.question_text}</td>
                  <td className="px-4 py-3">{faq.category}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setEditingFaq(faq);
                        setIsModalOpen(true);
                      }}
                      className="mr-3 font-medium text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(faq.faq_id)}
                      className="font-medium text-red-500 hover:underline"
                    >
                      Delete
                    </button>
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