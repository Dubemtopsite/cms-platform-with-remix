import {
  Card,
  Divider,
  Group,
  ScrollArea,
  Tree,
  type TreeNodeData,
} from "@mantine/core";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router";
import type { BlogArticleModel, BlogCategoryItemModel } from "~/model";

type CategoryBlogType = BlogCategoryItemModel & { article: BlogArticleModel[] };

export const CategoryTreeComponent = ({
  data,
}: {
  data: CategoryBlogType[];
}) => {
  const navigate = useNavigate();

  const categoryTreeList = useMemo<TreeNodeData[]>(() => {
    return data.map((item) => {
      return {
        value: item.id,
        label: item.categoryName,
        children: [
          ...item.article.map((article) => {
            return {
              value: `blog-article-item-${article.id}`,
              label: article.title,
            };
          }),
          {
            value: `new-item-${item.id}`,
            label: "Create New",
          },
        ],
      };
    });
  }, [data]);

  return (
    <>
      <Card
        radius={10}
        className="absolute w-[300px] min-h-[calc(100vh-220px)] max-h-[calc(100vh-220px)] bg-amber-500"
      >
        <ScrollArea className="!h-screen max-h-[calc(100vh-220px)]">
          <Tree
            data={categoryTreeList}
            levelOffset={23}
            renderNode={({ node, expanded, hasChildren, elementProps }) => {
              if (node.value.startsWith("new-item") && !hasChildren) {
                elementProps.onClick = () => {
                  navigate(`?category=${node.value.split("-item-")[1]}`);
                };
              } else if (node.value.startsWith("blog-article-item")) {
                elementProps.onClick = () => {
                  navigate(`?blog_id=${node.value.split("-item-")[1]}`);
                };
              }
              return (
                <Group gap={5} {...elementProps} py={10}>
                  {hasChildren && (
                    <ChevronDown
                      size={18}
                      style={{
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  )}
                  <span
                    className={
                      node.value.startsWith("new-item")
                        ? "text-brand underline underline-offset-4"
                        : ""
                    }
                  >
                    {node.label}
                  </span>
                </Group>
              );
            }}
          />
        </ScrollArea>
      </Card>
      <Divider
        orientation="vertical"
        className="absolute left-[312px] !h-screen max-h-[calc(100vh-220px)]"
      />
    </>
  );
};
