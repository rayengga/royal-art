export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin" />
        </div>
        <p className="text-gray-500 text-sm tracking-wide">Chargement...</p>
      </div>
    </div>
  );
}
