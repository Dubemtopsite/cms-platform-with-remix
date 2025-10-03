import { Button } from "@mantine/core";

interface Props {
  hideButton?: boolean;
  title?: string;
  message?: string;
  buttonText?: string;
  onReloadClicked?: () => void;
  parent?: "section" | "page";
}
export const PageErrorComponent = (props: Props) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${props.parent === "section" ? "min-h-[100px] py-5" : "min-h-[300px]"}`}
    >
      <h3 className="font-semibold text-xl">
        {props.title ?? "Error completing request"}
      </h3>
      <p className="max-w-[600px] text-center">
        {props.message ??
          "An error has occurred while fetching page content. Click on the button below to refresh."}
      </p>
      {!props.hideButton && (
        <Button
          onClick={() => props.onReloadClicked && props.onReloadClicked()}
          variant="primary"
          className="!w-auto"
        >
          {props.buttonText ?? "Reload page"}
        </Button>
      )}
    </div>
  );
};
