export function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-navy" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      {message}
    </div>
  );
}
