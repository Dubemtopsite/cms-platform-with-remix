import { Button, LoadingOverlay, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { decode } from "html-entities";
import { Save } from "lucide-react";
import { yupResolver } from "mantine-form-yup-resolver";
import { useEffect, useState } from "react";
import { useFetcher, useRevalidator, useSearchParams } from "react-router";
import { GeneralEditor } from "~/component/Base/Editor";
import { useAppModalToast } from "~/hook/useModalToast";
import { supabase } from "~/lib/supabase";
import type { BlogArticleItemProps } from "~/model";
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
  const blogId = searchParams.get("blog_id");

  useEffect(() => {
    if (blogId) {
      loadPageContent();
    } else if (categoryId && !blogId) {
      form.reset();
      form.setFieldValue("categoryId", categoryId);
    }
  }, [categoryId, blogId]);

  useEffect(() => {
    handleFetcherState();
  }, [fetcher]);

  const loadPageContent = async () => {
    try {
      if (blogId) {
        setIsRequestProcessing(true);
        const response = await fetch(`/api/fetch-blog-content/${blogId}`);
        const data = await response.json();
        const blogContent = data.data as BlogArticleItemProps;

        form.setValues({
          title: decode(blogContent.title),
          content: decode(blogContent.content),
          userId: blogContent.userId,
          categoryId: blogContent.category.id,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsRequestProcessing(false);
      }, 500);
    }
  };

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

    if (blogId) {
      await fetcher.submit(
        { ...values, userId: userId.data.user.id, articleId: blogId },
        {
          method: "POST",
          action: "/api/manage-blog-article",
        }
      );
    } else {
      await fetcher.submit(
        { ...values, userId: userId.data.user.id },
        {
          method: "POST",
          action: "/api/manage-blog-article",
        }
      );
    }
  };

  return (
    <div className="flex-1 brand-container px-4">
      <LoadingOverlay
        visible={isRequestProcessing}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      {isRequestProcessing === false && (
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

          <GeneralEditor
            placeholder={"Write a comment..."}
            key={form.key(`content`)}
            {...form.getInputProps(`content`)}
            label="Article Content"
          />
        </form>
      )}
    </div>
  );
};
