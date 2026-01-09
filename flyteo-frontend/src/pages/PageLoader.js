export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-palmGreen border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading Flyteo…</p>
      </div>
    </div>
  );
}
