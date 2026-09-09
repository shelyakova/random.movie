export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-white/60 dark:bg-black/60">
      <div className="flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-[#37C6F3] dark:border-zinc-700 dark:border-t-[#37C6F3]" />
      </div>
    </div>
  );
}
