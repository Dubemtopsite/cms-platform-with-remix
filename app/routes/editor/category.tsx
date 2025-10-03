import { decode } from "html-entities";
import { useLoaderData, useRevalidator } from "react-router";
import { CreateEditBlogCategoryModal } from "~/component/App/Blog/BlogCategoryModal";
import { RenderBlogCategoryListTable } from "~/component/App/Blog/BlogCategoryTable";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const categoryList = await prisma.platformCategory.findMany();

  return {
    categoryList: categoryList.map((item) => {
      return {
        ...item,
        categoryName: decode(item.categoryName),
      };
    }),
  };
}

export default function ContentCategoryPage() {
  const { categoryList } = useLoaderData<typeof loader>();
  const revalidate = useRevalidator();

  return (
    <div className="brand-container flex flex-col gap-6">
      <title>Category Page</title>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="display-text-1">Content Category </h1>
          <p className="text-sm text-light-text">
            Manage all platform blog categories
          </p>
        </div>

        <div>
          <CreateEditBlogCategoryModal
            reloadList={() => {
              revalidate.revalidate();
            }}
          />
        </div>
      </div>

      <div>
        <RenderBlogCategoryListTable
          data={categoryList}
          reloadList={() => revalidate.revalidate()}
        />
      </div>
    </div>
  );
}
