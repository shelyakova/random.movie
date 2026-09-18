import { ReactNode } from "react";
import { CloseIcon, EditIcon, RefreshIcon } from "./icons";
import Tooltip from "./Tooltip";

interface ModalProps {
  title: string;
  onRefresh?: () => void;
  refreshTooltip?: string;
  onEdit?: () => void;
  isEdit?: boolean;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
  hideFooterBorder?: boolean;
  className?: string;
}

export default function Modal({
  title,
  onRefresh,
  onEdit,
  isEdit,
  onClose,
  children,
  footer,
  hideFooterBorder = false,
  className,
}: ModalProps) {
  const editIconStyle = isEdit ? "cursor-pointer text-accent" : "cursor-pointer text-foreground";

  return (
    <div className="bg-backdrop fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={`bg-surface relative flex max-h-[90vh] w-full max-w-sm flex-col rounded-3xl p-6 ${className ?? ""}`}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-foreground text-2xl font-semibold">{title}</h2>

          <div className="flex shrink-0 items-center gap-3">
            {onRefresh && (
              <Tooltip content="Update from TMDB">
                <button
                  type="button"
                  onClick={onRefresh}
                  aria-label="Update from TMDB"
                  className="text-accent cursor-pointer"
                >
                  <RefreshIcon />
                </button>
              </Tooltip>
            )}

            {onEdit && (
              <Tooltip content="Edit">
                <button type="button" onClick={onEdit} aria-label="Edit" className={editIconStyle}>
                  <EditIcon />
                </button>
              </Tooltip>
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="text-foreground cursor-pointer"
              >
                <CloseIcon />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>

        {footer && (
          <div className={hideFooterBorder ? "mt-4" : "border-border-subtle mt-4 border-t pt-4"}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
