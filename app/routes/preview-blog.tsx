import { useLoaderData, useRevalidator } from "react-router";
import { prisma } from "~/lib/prisma";
import { validateUUID } from "~/lib/utils";
import type { Route } from "./+types/preview-blog";
import { PageErrorComponent } from "~/component/Base/PageErrorComponent";
import { decode } from "html-entities";
import { Text } from "@mantine/core";

export async function loader({ params }: Route.ActionArgs) {
  const blogId = params.blogId;
  if (!validateUUID(blogId)) {
    return {
      error: true,
      message: "Blog article does not exist",
    };
  }

  const blogItem = await prisma.platformArticle.findFirst({
    where: {
      id: blogId,
    },
    include: {
      category: true,
      user: true,
    },
  });
  if (!blogItem) {
    return {
      error: true,
      message: "Blog article does not exist",
    };
  }
  return {
    error: false,
    data: blogItem,
    message: "Blog article fetched successfully",
  };
}

export default function PreviewBlogContent() {
  const loaderResponse = useLoaderData<typeof loader>();
  const revalidate = useRevalidator();

  return (
    <div className="brand-container max-w-[700px] mx-auto">
      <title>Article Preview Page</title>
      {(loaderResponse.error || !loaderResponse.data) && (
        <PageErrorComponent
          message={loaderResponse.message}
          onReloadClicked={() => revalidate.revalidate()}
        />
      )}
      {!loaderResponse.error && loaderResponse.data && (
        <div className="flex flex-col gap-7 pt-[60px]">
          <div className="flex flex-col gap-3">
            <h4 className="display-text">
              {decode(loaderResponse.data.title)}
            </h4>
            <div className="flex flex-row flex-wrap gap-1.5 items-center">
              <p className=" text-sm lg:!text-base text-secondary">
                {loaderResponse.data.createdAt.toLocaleDateString()}
              </p>{" "}
              <span className="text-2xl"> &bull;</span>
              <p className=" text-sm lg:!text-base text-secondary">
                By {loaderResponse.data.user.email}
              </p>
              <span className="text-2xl"> &bull;</span>
              <Text className="!text-sm lg:!text-base  !text-secondary hover:!underline">
                {loaderResponse.data.category.categoryName}
              </Text>
            </div>
          </div>
          <div
            className="blog-paragraph flex flex-col ck-content"
            dangerouslySetInnerHTML={{ __html: loaderResponse.data.content }}
          ></div>
        </div>
      )}
    </div>
  );
}
