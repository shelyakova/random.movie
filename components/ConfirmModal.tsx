import Modal from "./Modal";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslations } from "next-intl";

interface ConfirmModalProps {
  title: string;
  message?: string;
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
  const t = useTranslations("common");

  return (
    <Modal
      title=""
      role="alertdialog"
      ariaLabel={message ? `${title} ${message}` : title}
      onClose={onCancel ?? onConfirm}
      hideFooterBorder
      className={message ? "min-h-[min(333px,90dvh)]" : "min-h-[min(250px,90dvh)]"}
      footer={
        <div className="flex gap-3">
          {onCancel && (
            <div className="flex-1">
              <Button
                onClick={onCancel}
                disabled={isPending}
                className="!bg-neutral-fill !mt-0 !text-zinc-700 dark:!text-zinc-300"
              >
                {t("cancel")}
              </Button>
            </div>
          )}

          <div className="relative flex-1 overflow-hidden rounded-full">
            <Button onClick={onConfirm} disabled={isPending} className="!mt-0">
              {confirmLabel ?? (onCancel ? t("yes") : t("ok"))}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground text-center text-base font-semibold">{title}</p>
        <p className="text-foreground mt-4 text-center text-[24px] font-bold">{message}</p>
      </div>

      {isPending && <LoadingSpinner />}
    </Modal>
  );
}
