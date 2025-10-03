import { validateUUID } from "~/lib/utils";
import type { Route } from "./+types/fetch-blog-content";
import { prisma } from "~/lib/prisma";

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
