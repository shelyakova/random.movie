import { ReactNode } from "react";
import { CloseIcon, EditIcon } from "./icons";

interface ModalProps {
  title: string;
  onEdit?: () => void;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function Modal({ title, onEdit, onClose, children, footer, className }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`relative flex max-h-[90vh] w-full max-w-sm flex-col rounded-3xl bg-white p-6 dark:bg-zinc-900 ${className ?? ""}`}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">{title}</h2>

          <div className="flex shrink-0 items-center gap-3">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                aria-label="Edit"
                className="cursor-pointer text-[#37C6F3]"
              >
                <EditIcon />
              </button>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="cursor-pointer text-black dark:text-white"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto min-h-0">{children}</div>

        {footer && <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">{footer}</div>}
      </div>
    </div>
  );
}
