import { NoData } from "./icons";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div className={`flex h-[263px] flex-col items-center justify-center gap-3 rounded-xl bg-zinc-200/60 dark:bg-zinc-900 ${className ?? ""}`}>
      <NoData />
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );
}
