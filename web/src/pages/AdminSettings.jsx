import { useRef, useState } from "react";
import { updateMe } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";

function initialsFor(firstName, lastName) {
  return `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";
}

export default function AdminSettings() {
  const { currentUser, updateCurrentUser } = useAuth();
  const [firstName, setFirstName] = useState(currentUser?.first_name ?? "");
  const [lastName, setLastName] = useState(currentUser?.last_name ?? "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const avatarSrc = previewUrl || currentUser?.profile_picture;

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFeedback(null);
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      if (selectedFile) {
        formData.append("profile_picture", selectedFile);
      }
      const { data } = await updateMe(formData);
      updateCurrentUser(data);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setFeedback({ type: "success", message: "Profile updated." });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Could not update profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="max-w-md">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-medium text-navy">{currentUser?.email}</p>
        <p className="text-sm text-gray-500">
          Role: {currentUser?.role === "superadmin" ? "Super Admin" : currentUser?.role}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <h3 className="text-sm font-semibold text-navy">Edit profile</h3>

        <div className="flex items-center gap-4">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt="Profile"
              className="h-16 w-16 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-navy/10 text-lg font-bold text-navy">
              {initialsFor(firstName, lastName)}
            </div>
          )}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-gray-300 px-3 py-1.5 text-sm font-medium text-navy transition-colors hover:border-gold"
            >
              Change photo
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">First name</label>
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-600">Last name</label>
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          />
        </div>

        {feedback && (
          <p className={`text-sm ${feedback.type === "success" ? "text-status-resolved" : "text-red-600"}`}>
            {feedback.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-navy px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </section>
  );
}
