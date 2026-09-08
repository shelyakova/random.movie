export default function LoadingSpinner() {
  return (
    <div className="flex h-[263px] items-center justify-center rounded-xl bg-zinc-200/60 dark:bg-zinc-900">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-[#37C6F3] dark:border-zinc-700 dark:border-t-[#37C6F3]" />
    </div>
  );
}
