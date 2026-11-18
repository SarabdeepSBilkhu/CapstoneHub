export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-3 px-4 text-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600" />
      <p className="text-xs text-gray-400">Loading...</p>
    </div>
  );
}
