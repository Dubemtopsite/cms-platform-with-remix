import { Button } from "@mantine/core";
import { Archive } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  message?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showButton?: boolean;
  containerClass?: string;
  icon?: ReactNode;
}

export const EmptyContentComponent = (props: Props) => {
  return (
    <div
      className={`flex min-h-[400px] flex-col items-center justify-center gap-5 ${props.containerClass}`}
    >
      {props.icon ?? (
        <Archive
          size="120"
          className="!stroke-gray-700 dark:!stroke-light-text"
        />
      )}
      <h3 className="text-center font-semibold">
        {props.title ?? "Looks like there’s nothing here yet"}
      </h3>
      <p className="max-w-[700px] text-center">
        {props.message ??
          "It appears this section is empty for now. Items may be added soon, or you might need to refresh to see the latest content."}
      </p>
      {props.showButton && (
        <Button
          variant="primary"
          className="!w-auto !px-10"
          onClick={props.onButtonClick}
        >
          {props.buttonText ?? "Try Again"}
        </Button>
      )}
    </div>
  );
};
