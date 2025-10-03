import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/delete-category";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const category_id = formData.get("category_id") as string;

  const doItemExist = await prisma.platformCategory.findFirst({
    where: {
      id: category_id,
    },
  });

  if (!doItemExist) {
    return {
      error: true,
      message: "Category does not exist",
    };
  }

  await prisma.platformCategory.delete({
    where: {
      id: category_id,
    },
  });

  return {
    error: false,
    message: "Category deleted successfully",
  };
}
