import { useState } from "react";

export default function PhaseFormModal({ initialPhase, onSave, onClose }) {
  const [name, setName] = useState(initialPhase?.name ?? "");
  const [startDate, setStartDate] = useState(initialPhase?.start_date ?? "");
  const [endDate, setEndDate] = useState(initialPhase?.end_date ?? "");
  const [guidanceMessage, setGuidanceMessage] = useState(initialPhase?.guidance_message ?? "");
  const [suggestedQuestionsText, setSuggestedQuestionsText] = useState(
    (initialPhase?.suggested_questions ?? []).join("\n")
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSaving(true);
    try {
      await onSave({
        name,
        start_date: startDate,
        end_date: endDate,
        guidance_message: guidanceMessage,
        suggested_questions: suggestedQuestionsText
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
      });
      onClose();
    } catch (error) {
      const details = error.response?.data?.details;
      const firstDetail = details ? Object.values(details)[0]?.[0] : null;
      setErrorMessage(firstDetail || error.response?.data?.message || "Could not save this phase.");
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
          {initialPhase ? "Edit Phase" : "Add Phase"}
        </h3>

        <label className="mb-1 block text-sm text-gray-600">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. Enrollment Period"
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <div className="mb-3 grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm text-gray-600">Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-600">End date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
            />
          </div>
        </div>

        <label className="mb-1 block text-sm text-gray-600">Guidance message</label>
        <textarea
          value={guidanceMessage}
          onChange={(e) => setGuidanceMessage(e.target.value)}
          rows={3}
          placeholder="Shown to students in the chat banner during this phase"
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <label className="mb-1 block text-sm text-gray-600">Suggested questions (one per line)</label>
        <textarea
          value={suggestedQuestionsText}
          onChange={(e) => setSuggestedQuestionsText(e.target.value)}
          rows={4}
          placeholder={"How do I apply for a scholarship?\nWhat are the enrollment requirements?"}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        {errorMessage && <p className="mb-3 text-sm text-red-600">{errorMessage}</p>}

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
