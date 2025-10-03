import { Button } from "@mantine/core";
import { modals } from "@mantine/modals";

interface OpenModalProps {
  title: string;
  message: string;
  hideCloseButton?: boolean;
  content?: React.ReactNode;
  buttonText?: string;
}

interface OpenConformModalProps {
  title: string;
  message?: string;
  content?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;
  confirmText?: string;
}

export const useAppModalToast = () => {
  // const [isOpen, setIsOpen] = useState(false);

  const openModal = (props: OpenModalProps) => {
    modals.open({
      title: props.title,
      centered: true,
      size: "sm",
      radius: "md",
      children: props.content ?? (
        <div className="flex flex-col items-center">
          <p className="text-center">{props.message}</p>
          {!props.hideCloseButton && (
            <Button
              className="mt-3 "
              variant="primary"
              onClick={() => modals.closeAll()}
            >
              {props.buttonText ?? "Close"}
            </Button>
          )}
        </div>
      ),
    });
  };

  const openConfirmModal = (props: OpenConformModalProps) => {
    modals.openConfirmModal({
      title: props.title,
      centered: true,
      size: "sm",
      radius: "md",
      children: props.content ?? (
        <p className="text-center">{props.message ?? ""}</p>
      ),
      labels: {
        confirm: props.confirmText ?? "Confirm",
        cancel: "Cancel",
      },
      onConfirm: props.onConfirm,
      onCancel: props.onCancel,
    });
  };

  return {
    openModal,
    openConfirmModal,
  };
};
