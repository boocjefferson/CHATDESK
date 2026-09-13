import { useState } from "react";

export default function OfficeFormModal({ initialOffice, onSave, onClose }) {
  const [name, setName] = useState(initialOffice?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSaving(true);
    try {
      await onSave({ name });
      onClose();
    } catch (error) {
      const details = error.response?.data?.details;
      const firstDetail = details ? Object.values(details)[0]?.[0] : null;
      setErrorMessage(firstDetail || error.response?.data?.message || "Could not save this office.");
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
          {initialOffice ? "Edit Office" : "Add Office"}
        </h3>

        <label className="mb-1 block text-sm text-gray-600">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. College of Information Technology and Computing"
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
