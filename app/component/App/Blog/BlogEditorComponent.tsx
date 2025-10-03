import {
  Button,
  LoadingOverlay,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Save } from "lucide-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { use, useEffect, useState } from "react";
import { useFetcher, useRevalidator, useSearchParams } from "react-router";
import { useAppModalToast } from "~/hook/useModalToast";
import { supabase } from "~/lib/supabase";
import {
  CreateEditBlogArticleValidator,
  type CreateEditBlogArticleRequestModel,
} from "~/validators";
// import ClientSideCustomEditor from "~/component/Base/Editor/custom-editor";

export const BlogEditorComponent = ({
  categoryList,
}: {
  categoryList: { id: string; categoryName: string }[];
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();
  const revalidate = useRevalidator();
  const { openModal } = useAppModalToast();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const form = useForm({
    initialValues: {
      title: "",
      content: "",
      userId: "",
      categoryId: "",
    },
    validate: yupResolver(CreateEditBlogArticleValidator),
  });

  const categoryId = searchParams.get("category");

  useEffect(() => {
    if (categoryId) {
      form.setFieldValue("categoryId", categoryId);
    }
  }, [categoryId]);

  useEffect(() => {
    handleFetcherState();
  }, [fetcher]);

  const handleFetcherState = async () => {
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
      await revalidate.revalidate();
      setIsRequestProcessing(false);

      // close();
      // if (reloadList) {
      //   reloadList();
      // }
    }
  };

  const handleSubmit = async (values: CreateEditBlogArticleRequestModel) => {
    setIsRequestProcessing(true);
    const userId = await supabase.auth.getUser();

    if (userId.error || userId.data === null || userId.data.user === null) {
      openModal({
        title: "Error",
        message:
          "Something went wrong while processing request. Please try again later.",
      });
      return;
    }

    await fetcher.submit(
      { ...values, userId: userId.data.user.id },
      {
        method: "POST",
        action: "/api/manage-blog-article",
      }
    );
  };

  return (
    <div className="flex-1 brand-container px-4">
      <LoadingOverlay
        visible={isRequestProcessing}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
        className="flex flex-col gap-4 mt-2 mb-2"
      >
        <div className="flex justify-between">
          <div></div>
          <div>
            <Button type="submit" variant="filled">
              <div className="flex items-center ">
                {" "}
                <Save size={16} className="mr-2" /> Save Content
              </div>
            </Button>
          </div>
        </div>
        <TextInput
          label="Article title"
          type="text"
          placeholder="Enter your article title"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />

        <Select
          label="Article Category"
          placeholder="Select a category"
          allowDeselect={false}
          searchable
          data={categoryList.map((item) => {
            return {
              value: item.id,
              label: `${item.categoryName}`,
            };
          })}
          key={form.key("categoryId")}
          {...form.getInputProps("categoryId")}
        />

        <Textarea
          label="Article Content"
          placeholder="Enter your article content"
          key={form.key("content")}
          {...form.getInputProps("content")}
          minRows={10}
          rows={10}
        />

        {/* <ClientSideCustomEditor
          placeholder={"Write a comment..."}
          key={form.key(`content`)}
          {...form.getInputProps(`content`)}
          editorType="COMMENT"
        /> */}
      </form>
    </div>
  );
};
