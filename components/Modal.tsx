import { ReactNode } from "react";
import { CloseIcon, EditIcon } from "./icons";

interface ModalProps {
  title: string;
  onEdit?: () => void;
  isEdit?: boolean;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  hideFooterBorder?: boolean;
  className?: string;
}

export default function Modal({ title, onEdit, isEdit, onClose, children, footer, hideFooterBorder = false, className }: ModalProps) {
  const editIconStyle = isEdit ? 'cursor-pointer text-[#37C6F3]' : 'cursor-pointer text-black dark:text-white';

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
                className={editIconStyle}
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

        <div className="mt-4 flex flex-1 flex-col overflow-y-auto min-h-0">{children}</div>

        {footer && (
          <div className={hideFooterBorder ? "mt-4" : "mt-4 border-t border-zinc-200 pt-4 dark:border-zinc-800"}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
