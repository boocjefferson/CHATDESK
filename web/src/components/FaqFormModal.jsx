import { useState } from "react";

const CATEGORIES = ["Enrollment", "Scholarship", "Clearance", "Discipline", "General"];

export default function FaqFormModal({ initialFaq, onSave, onClose }) {
  const [intentKeyword, setIntentKeyword] = useState(initialFaq?.intent_keyword ?? "");
  const [questionText, setQuestionText] = useState(initialFaq?.question_text ?? "");
  const [answerContent, setAnswerContent] = useState(initialFaq?.answer_content ?? "");
  const [category, setCategory] = useState(initialFaq?.category ?? CATEGORIES[0]);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({
        intent_keyword: intentKeyword,
        question_text: questionText,
        answer_content: answerContent,
        category,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
      >
        <h3 className="mb-4 text-lg font-bold text-navy">
          {initialFaq ? "Edit FAQ" : "Add FAQ"}
        </h3>

        <label className="mb-1 block text-sm text-gray-600">Intent keyword</label>
        <input
          value={intentKeyword}
          onChange={(e) => setIntentKeyword(e.target.value)}
          required
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <label className="mb-1 block text-sm text-gray-600">Question</label>
        <input
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          required
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <label className="mb-1 block text-sm text-gray-600">Answer</label>
        <textarea
          value={answerContent}
          onChange={(e) => setAnswerContent(e.target.value)}
          required
          rows={4}
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <label className="mb-1 block text-sm text-gray-600">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-1.5 text-sm text-gray-500 transition-colors hover:text-navy"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}