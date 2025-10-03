import {
  ActionIcon,
  Card,
  LoadingOverlay,
  Table,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { decode } from "html-entities";
import { CircleX, FilePenLine, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher, useNavigate } from "react-router";
import { useAppModalToast } from "~/hook/useModalToast";
import type {
  BlogArticleItemProps,
  BlogArticleModel,
  BlogCategoryItemModel,
} from "~/model";

export const RenderBlogArticleListTable = ({
  data,
  reloadList,
}: {
  data: BlogArticleItemProps[];
  reloadList: () => void;
}) => {
  const fetcher = useFetcher();
  const [records, setRecords] = useState(data);
  const { openConfirmModal, openModal } = useAppModalToast();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    setRecords(data);
  }, [data]);

  useEffect(() => {
    setRecords(
      data.filter(({ title }) => {
        if (
          debouncedQuery !== "" &&
          !title.toLowerCase().includes(debouncedQuery.toLowerCase())
        )
          return false;

        return true;
      })
    );
  }, [debouncedQuery]);

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
      if (reloadList) {
        reloadList();
      }
    }
  }, [fetcher]);

  const deleteItem = (item: BlogArticleItemProps) => {
    openConfirmModal({
      title: "Delete Article",
      message: `Are you sure you want to delete the article with title "${item.title}"?`,
      onConfirm: async () => {
        setIsRequestProcessing(true);
        await fetcher.submit(
          { blog_id: item.id },
          { method: "DELETE", action: "/api/delete-article" }
        );
      },
    });
  };

  return (
    <>
      <LoadingOverlay
        visible={isRequestProcessing}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <Card radius={10}>
        <div className="mb-5">
          <TextInput
            label="Filter"
            placeholder="Search blog article..."
            leftSection={<Search size={16} />}
            rightSection={
              <ActionIcon
                size="sm"
                variant="transparent"
                c="dimmed"
                onClick={() => setQuery("")}
              >
                <CircleX size={14} />
              </ActionIcon>
            }
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
          />
        </div>

        <Table.ScrollContainer minWidth={420}>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th w={40}>S/N</Table.Th>
                <Table.Th miw={350}>Blog title</Table.Th>
                <Table.Th w={150} className="min-w-[150px]">
                  Category
                </Table.Th>
                <Table.Th w={150} className="min-w-[150px]">
                  Author
                </Table.Th>
                <Table.Th w={200} className="min-w-[150px]">
                  Created At
                </Table.Th>

                <Table.Th w={250} className="min-w-[150px]">
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {records.map((item, index) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{decode(item.title)}</Table.Td>
                  <Table.Td>{decode(item.category.categoryName)}</Table.Td>
                  <Table.Td>{item.user.email}</Table.Td>
                  <Table.Td>{item.createdAt.toLocaleString()}</Table.Td>

                  <Table.Td>
                    <div className="flex gap-5 items-center">
                      <UnstyledButton className="!text-brand !underline underline-offset-4">
                        View Article
                      </UnstyledButton>
                      <ActionIcon
                        size={25}
                        variant="subtle"
                        color="brand"
                        onClick={() => {
                          navigate(
                            `/editor/new?blog_id=${item.id}&category=${item.categoryId}`
                          );
                        }}
                      >
                        <FilePenLine size={30} />
                      </ActionIcon>
                      <ActionIcon
                        size={25}
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          deleteItem(item);
                        }}
                      >
                        <Trash2 size={30} />
                      </ActionIcon>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>
    </>
  );
};
