import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/delete-article";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const blogId = formData.get("blog_id") as string;

  const doItemExist = await prisma.platformArticle.findFirst({
    where: {
      id: blogId,
    },
  });

  if (!doItemExist) {
    return {
      error: true,
      message: "Blog article does not exist",
    };
  }

  await prisma.platformArticle.delete({
    where: {
      id: blogId,
    },
  });

  return {
    error: false,
    message: "Blog article deleted successfully",
  };
}
