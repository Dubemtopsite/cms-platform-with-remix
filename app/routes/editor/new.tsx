import { Divider } from "@mantine/core";
import { decode } from "html-entities";
import { useMemo } from "react";
import { useLoaderData } from "react-router";
import { BlogEditorComponent } from "~/component/App/Blog/BlogEditorComponent";
import { CategoryTreeComponent } from "~/component/App/Blog/CategoryTreeComponent";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const categoryBlogList = await prisma.platformCategory.findMany({
    include: {
      article: true,
    },
  });

  return {
    categoryList: categoryBlogList.map((item) => {
      return {
        ...item,
        categoryName: decode(item.categoryName),
      };
    }),
  };
}

export default function BlogEditorPage() {
  const loaderResponse = useLoaderData<typeof loader>();

  const categoryList = useMemo(() => {
    return loaderResponse.categoryList.map((item) => {
      return {
        id: item.id,
        categoryName: decode(item.categoryName),
      };
    });
  }, [loaderResponse.categoryList]);
  return (
    <div className="flex flex-col gap-5">
      <title>Editor Page</title>
      <div className="flex justify-between items-center brand-container">
        <div>
          <h1 className="display-text-1">Create Content </h1>
          <p className="text-sm text-light-text">
            Manage platform blog content
          </p>
        </div>
      </div>

      <Divider />

      <div className="flex flex-row gap-3 relative">
        <CategoryTreeComponent data={loaderResponse.categoryList} />
        <BlogEditorComponent categoryList={categoryList} />
      </div>
    </div>
  );
}
