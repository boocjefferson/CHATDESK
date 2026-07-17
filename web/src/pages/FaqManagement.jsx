import { useEffect, useState } from "react";
import { createFaq, deleteFaq, getFaqs, updateFaq } from "../api/faqs.js";
import FaqFormModal from "../components/FaqFormModal.jsx";

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
  }   else {
      await createFaq(payload);
  }
  loadFaqs();
};

  if (isLoading) return <p>Loading FAQs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
<section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">FAQs</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            className="rounded-full border border-gray-300 px-4 py-1 text-sm text-navy placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => {
              setEditingFaq(null);
              setIsModalOpen(true);
            }}
            className="rounded-full border border-gold px-4 py-1 text-sm text-navy"
          >
            Add FAQ
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-300">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-300 bg-navy text-sm text-white">
              <th className="px-4 py-3 font-semibold">FAQ</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((faq) => (
              <tr key={faq.faq_id} className="border-b border-gray-200 text-navy last:border-0">
                <td className="px-4 py-3">{faq.question_text}</td>
                <td className="px-4 py-3">{faq.category}</td>
<td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setIsModalOpen(true);
                    }}
                    className="mr-3 text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(faq.faq_id)}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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