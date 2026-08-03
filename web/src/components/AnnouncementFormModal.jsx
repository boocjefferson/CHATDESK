import { useState } from "react";

export default function AnnouncementFormModal({ initialAnnouncement, onSave, onClose }) {
  const [title, setTitle] = useState(initialAnnouncement?.title ?? "");
  const [content, setContent] = useState(initialAnnouncement?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave({ title, content });
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
          {initialAnnouncement ? "Edit Announcement" : "Broadcast Announcement"}
        </h3>

        <label className="mb-1 block text-sm text-gray-600">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mb-3 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

        <label className="mb-1 block text-sm text-gray-600">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={5}
          className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gold/40"
        />

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
            {isSaving ? "Broadcasting..." : "Broadcast"}
          </button>
        </div>
      </form>
    </div>
  );
}
