// Placeholder view - matches ui-prototype/admin_faq_management.png layout.
// Live CRUD wiring happens in Sprint 2 (feature/faq-api-endpoints, feature/web-faq-manager).
const placeholderFaqs = [
  { id: 1, question: "Question 1", category: "Requirements" },
  { id: 2, question: "Question 2", category: "Event Schedule" },
  { id: 3, question: "Question 3", category: "Entrance Exam" },
];

export default function FaqManagement() {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-navy">FAQs</h3>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search"
            disabled
            className="rounded-full border border-gray-300 px-4 py-1 text-sm text-navy placeholder:text-gray-400"
          />
          <button
            type="button"
            disabled
            title="Coming soon"
            className="cursor-not-allowed rounded-full border border-gold/50 px-4 py-1 text-sm text-gold/50"
          >
            Add FAQ
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-gray-300 px-4 py-3">
        <span className="font-medium text-navy">Filters</span>
        <span className="rounded-full border border-gold px-3 py-1 text-sm text-navy">All Types</span>
        <span className="ml-auto rounded-full border border-gold px-3 py-1 text-sm text-navy">Sort: A-Z</span>
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
            {placeholderFaqs.map((faq) => (
              <tr key={faq.id} className="border-b border-gray-200 text-navy last:border-0">
                <td className="px-4 py-3">{faq.question}</td>
                <td className="px-4 py-3">{faq.category}</td>
                <td className="px-4 py-3 text-right text-gray-400">Coming soon</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-500">
        Live FAQ data lands in Sprint 2 (GET/POST/PATCH/DELETE /api/v1/faqs/ per API_CONTRACT.md).
      </p>
    </section>
  );
}
