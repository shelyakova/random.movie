import Button from "./Button";
import { CloseIcon } from "./icons";

interface ErrorModalProps {
  title: string;
  description?: string;
  onClose: () => void;
}

export default function ErrorModal({ title, description, onClose }: ErrorModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="relative flex w-full max-w-sm flex-col items-center rounded-3xl bg-white p-6 text-center dark:bg-zinc-900">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 cursor-pointer text-black dark:text-white"
        >
          <CloseIcon />
        </button>

        <p className="mt-6 text-base font-semibold text-zinc-500 dark:text-zinc-400">{title}</p>

        {description && (
          <p className="mt-4 text-[24px] font-bold text-black dark:text-white">{description}</p>
        )}

        <Button onClick={onClose} className="mt-6">
          Ok
        </Button>
      </div>
    </div>
  );
}
