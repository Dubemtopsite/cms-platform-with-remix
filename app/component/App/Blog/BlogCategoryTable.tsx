import {
  ActionIcon,
  Card,
  LoadingOverlay,
  ScrollArea,
  Table,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { CircleX, FilePenLine, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useAppModalToast } from "~/hook/useModalToast";
import type { BlogCategoryItemModel } from "~/model";
import { CreateEditBlogCategoryModal } from "./BlogCategoryModal";

export const RenderBlogCategoryListTable = ({
  data,
  reloadList,
}: {
  data: BlogCategoryItemModel[];
  reloadList: () => void;
}) => {
  const fetcher = useFetcher();
  const [records, setRecords] = useState(data);
  const { openConfirmModal, openModal } = useAppModalToast();
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const [query, setQuery] = useState("");
  const [editItem, setEditItem] = useState<BlogCategoryItemModel | null>();

  const [debouncedQuery] = useDebouncedValue(query, 200);

  useEffect(() => {
    setRecords(data);
  }, [data]);

  useEffect(() => {
    setRecords(
      data.filter(({ categoryName }) => {
        if (
          debouncedQuery !== "" &&
          !categoryName.toLowerCase().includes(debouncedQuery.toLowerCase())
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

  const deleteCategoryItem = (item: BlogCategoryItemModel) => {
    openConfirmModal({
      title: "Delete Category",
      message: `Are you sure you want to delete the category with title "${item.categoryName}"?`,
      onConfirm: async () => {
        setIsRequestProcessing(true);
        await fetcher.submit(
          { category_id: item.id },
          { method: "POST", action: "/api/delete-category" }
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
            placeholder="Search blog category..."
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
                <Table.Th miw={350}>Category name</Table.Th>

                <Table.Th w={150} className="min-w-[150px]">
                  Action
                </Table.Th>
              </Table.Tr>
            </Table.Thead>

            <Table.Tbody>
              {records.map((item, index) => (
                <Table.Tr key={item.id}>
                  <Table.Td>{index + 1}</Table.Td>
                  <Table.Td>{item.categoryName}</Table.Td>

                  <Table.Td>
                    <div className="flex gap-5 items-center">
                      <ActionIcon
                        size={25}
                        variant="subtle"
                        color="brand"
                        onClick={() => {
                          setEditItem(item);
                        }}
                      >
                        <FilePenLine size={30} />
                      </ActionIcon>
                      <ActionIcon
                        size={25}
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          deleteCategoryItem(item);
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

      {editItem && (
        <CreateEditBlogCategoryModal
          editItem={editItem}
          reloadList={reloadList}
          onClose={() => setEditItem(null)}
        />
      )}
    </>
  );
};
