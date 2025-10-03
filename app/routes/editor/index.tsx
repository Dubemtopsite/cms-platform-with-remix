import { Button } from "@mantine/core";
import { Plus } from "lucide-react";
import { Link, useLoaderData, useRevalidator } from "react-router";
import { RenderBlogArticleListTable } from "~/component/App/Blog/BlogArticleListTable";
import { EmptyContentComponent } from "~/component/Base/EmptyContentComponent";
import { prisma } from "~/lib/prisma";

export function meta() {
  return [
    { title: "Editor Page" },
    { name: "description", content: "Welcome to Editor Page" },
  ];
}

export async function loader() {
  const blogArticleList = await prisma.platformArticle.findMany({
    include: {
      category: true,
      user: true,
    },
  });
  return {
    blogArticleList,
  };
}

export default function EditorIndexPage() {
  const loaderResponse = useLoaderData<typeof loader>();
  const revalidate = useRevalidator();

  return (
    <div className="brand-container flex flex-col gap-6">
      <title>Editor Page</title>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="display-text-1">Content Overview </h1>
          <p className="text-sm text-light-text">
            Manage platform blog content
          </p>
        </div>

        <div>
          <Button variant="filled" component={Link} to={`/editor/new`}>
            <div className="flex items-center ">
              {" "}
              <Plus size={16} className="mr-2" /> Add new content
            </div>
          </Button>
        </div>
      </div>

      <div>
        {loaderResponse.blogArticleList.length > 0 ? (
          <RenderBlogArticleListTable
            data={loaderResponse.blogArticleList}
            reloadList={() => revalidate.revalidate()}
          />
        ) : (
          <EmptyContentComponent
            title="No content found"
            message="It appears this section is empty for now. Items may be added soon, or you might need to refresh to see the latest content."
          />
        )}
      </div>
    </div>
  );
}
