import { prisma } from "~/lib/prisma";
import type { Route } from "../editor/+types/category";
import { encode } from "html-entities";
import { createUUID, generateSlug } from "~/lib/utils";

const checkIfTitleExist = async (title: string, id?: string) => {
  if (id) {
    const doTitleExist = await prisma.platformCategory.findFirst({
      where: {
        categoryName: title,
        id: {
          not: id,
        },
      },
    });
    return doTitleExist;
  }
  const doTitleExist = await prisma.platformCategory.findFirst({
    where: {
      categoryName: title,
    },
  });

  return doTitleExist;
};

export async function action({ request }: Route.ActionArgs) {
  const payload = await request.formData();

  const title = payload.get("title");
  const category_id = payload.get("category_id") as string;

  const encodedTitle = encode(title as string);

  if (category_id) {
    const doTitleExist = await checkIfTitleExist(encodedTitle, category_id);
    if (doTitleExist) {
      return {
        error: true,
        message: "Category already exist",
      };
    }

    await prisma.platformCategory.update({
      where: {
        id: category_id,
      },
      data: {
        categoryName: encodedTitle,
        categorySlug: generateSlug(encodedTitle),
      },
    });

    return {
      error: false,
      message: "Category updated successfully",
    };
  } else {
    const doTitleExist = await checkIfTitleExist(encodedTitle);
    if (doTitleExist) {
      return {
        error: true,
        message: "Category already exist",
      };
    }

    await prisma.platformCategory.create({
      data: {
        id: createUUID(),
        categoryName: encodedTitle,
        categorySlug: generateSlug(encodedTitle),
      },
    });

    return {
      error: false,
      message: "Category created successfully",
    };
  }
}
