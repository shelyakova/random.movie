interface LoadingSpinnerProps {
  overlay?: boolean;
  className?: string;
}

export default function LoadingSpinner({ overlay = true, className }: LoadingSpinnerProps) {
  const spinner = (
    <div className="border-disabled border-t-accent h-10 w-10 animate-spin rounded-full border-4" />
  );

  if (!overlay) {
    return <div className={`flex items-center justify-center ${className ?? ""}`}>{spinner}</div>;
  }

  return (
    <div
      className={`bg-overlay absolute inset-0 z-10 flex items-center justify-center rounded-3xl ${className ?? ""}`}
    >
      {spinner}
    </div>
  );
}
