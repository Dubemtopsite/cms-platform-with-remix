import { Button, Modal, ScrollArea, Textarea, TextInput } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  CreateEditBlogCategoryValidator,
  type CreateEditBlogCategoryRequestModel,
} from "../../../validators";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAppModalToast } from "~/hook/useModalToast";
import { yupResolver } from "mantine-form-yup-resolver";
import { useFetcher } from "react-router";
import type { BlogCategoryItemModel } from "~/model";

interface Props {
  reloadList?: () => void;
  editItem?: BlogCategoryItemModel;
  onClose?: () => void;
}

export const CreateEditBlogCategoryModal = ({
  reloadList,
  editItem,
  onClose,
}: Props) => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 50em)");
  const { openModal } = useAppModalToast();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const fetcher = useFetcher();

  const form = useForm({
    initialValues: {
      category_id: "",
      title: "",
    },
    validate: yupResolver(CreateEditBlogCategoryValidator),
  });

  useEffect(() => {
    if (editItem) {
      form.setValues({
        category_id: editItem.id,
        title: editItem.categoryName,
      });
      open();
    }
  }, [editItem]);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && fetcher.data.error) {
      openModal({
        title: "Error",
        message: fetcher.data.message,
      });
      setIsRequestProcessing(false);
    } else if (
      fetcher.state === "idle" &&
      fetcher.data &&
      !fetcher.data.error
    ) {
      openModal({
        title: "Success",
        message: fetcher.data.message,
      });
      setIsRequestProcessing(false);
      close();
      form.reset();
      if (reloadList) {
        reloadList();
      }
    }
  }, [fetcher]);

  const handleSubmit = async (values: CreateEditBlogCategoryRequestModel) => {
    setIsRequestProcessing(true);
    try {
      await fetcher.submit(
        { category_id: values.category_id ?? "", title: values.title },
        { method: "POST", action: "/api/manage-category" }
      );

      //   const { status, data } = await CreateEditBlogCategory(
      //     axiosClient,
      //     formData
      //   );

      //   if (status !== 200 || data.error) {
      //     throw Error(data.message ?? "Error processing request");
      //   }

      //   close();
      //   form.reset();
      //   if (reloadList) {
      //     reloadList();
      //   }
      //   if (onClose) {
      //     onClose();
      //   }
    } catch (error) {
      openModal({
        title: "Error",
        message: (error as any).message ?? "Error completing action",
      });
      setIsRequestProcessing(false);
    }
  };

  return (
    <>
      {editItem === undefined && (
        <div>
          <Button
            variant="filled"
            onClick={() => {
              form.reset();
              open();
            }}
          >
            <div className="flex items-center ">
              {" "}
              <Plus size={16} className="mr-2" /> Add new category
            </div>
          </Button>
        </div>
      )}
      <Modal
        opened={opened}
        onClose={() => {
          close();
          if (onClose) {
            onClose();
          }
        }}
        title={editItem ? "Edit Blog Category" : "Create Blog Category"}
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
        size={"md"}
        fullScreen={isMobile}
        scrollAreaComponent={ScrollArea.Autosize}
        classNames={{
          body: "h-full",
        }}
      >
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          className="relative flex flex-col gap-5 "
          inert={isRequestProcessing}
        >
          <TextInput
            label="Category title"
            placeholder="Enter category title"
            type="text"
            key={form.key("title")}
            {...form.getInputProps("title")}
          />

          <Button type="submit" variant="primary" loading={isRequestProcessing}>
            {editItem ? "Update" : "Create"}
          </Button>
        </form>
      </Modal>
    </>
  );
};
