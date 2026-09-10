import Modal from "./Modal";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  isPending?: boolean;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  isPending = false,
}: ConfirmModalProps) {
  return (
    <Modal
      title=""
      onClose={onCancel ?? onConfirm}
      hideFooterBorder
      className="min-h-[333px]"
      footer={
        <div className="flex gap-3">
          {onCancel && (
            <div className="flex-1">
              <Button
                onClick={onCancel}
                disabled={isPending}
                className="!mt-0 !bg-zinc-200 !text-zinc-700 dark:!bg-zinc-800 dark:!text-zinc-300"
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="relative flex-1 overflow-hidden rounded-full">
            <Button onClick={onConfirm} disabled={isPending} className="!mt-0">
              {confirmLabel ?? (onCancel ? "Yes" : "Ok")}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-center text-base font-semibold text-zinc-500 dark:text-zinc-400">{title}</p>
        <p className="mt-4 text-center text-[24px] font-bold text-black dark:text-white">{message}</p>
      </div>

      {isPending && <LoadingSpinner />}
    </Modal>
  );
}
