import { NoData } from "./icons";

interface EmptyStateProps {
  message: string;
  className?: string;
}

export default function EmptyState({ message, className }: EmptyStateProps) {
  return (
    <div
      className={`bg-placeholder-bg flex h-[263px] flex-col items-center justify-center gap-3 rounded-xl ${className ?? ""}`}
    >
      <NoData />
      <p className="text-muted-foreground text-sm font-medium">{message}</p>
    </div>
  );
}
