import { prisma } from "~/lib/prisma";
import type { Route } from "./+types/manage-blog-article";
import { encode } from "html-entities";
import { generateSlug } from "~/lib/utils";
import { getUserRowBySupabaseId } from "~/lib/utils/server-utils";

const doArticleTitleExist = async (title: string, id?: string) => {
  if (id) {
    const doTitleExist = await prisma.platformArticle.findFirst({
      where: {
        title: title,
        id: {
          not: id,
        },
      },
    });
    return doTitleExist;
  } else {
    const doTitleExist = await prisma.platformArticle.findFirst({
      where: {
        title: title,
      },
    });
    return doTitleExist;
  }
};

export async function action({ request }: Route.ActionArgs) {
  const payload = await request.formData();

  const title = payload.get("title");
  const content = payload.get("content");
  const user_id = payload.get("userId");
  const category_id = payload.get("categoryId") as string;
  const articleId = payload.get("articleId");

  const encodedTitle = encode(title as string);
  const encodedContent = encode(content as string);

  const articleSlug = generateSlug(encodedTitle);

  const doUserExist = await getUserRowBySupabaseId(user_id as string);

  if (!doUserExist) {
    return {
      error: true,
      message: "User does not exist",
    };
  }

  if (articleId) {
    const doTitleExist = await doArticleTitleExist(
      encodedTitle,
      articleId as string
    );
    if (doTitleExist) {
      return {
        error: true,
        message: "Title already exist",
      };
    }

    await prisma.platformArticle.update({
      where: {
        id: articleId as string,
      },
      data: {
        title: encodedTitle,
        content: encodedContent,
        slug: articleSlug,
        categoryId: category_id as string,
        // userId: user_id as string,
      },
    });

    return {
      error: false,
      message: "Article updated successfully",
    };
  } else {
    const doTitleExist = await doArticleTitleExist(encodedTitle);
    if (doTitleExist) {
      return {
        error: true,
        message: "Title already exist",
      };
    }

    await prisma.platformArticle.create({
      data: {
        title: encodedTitle,
        content: encodedContent,
        slug: articleSlug,
        categoryId: category_id as string,
        userId: doUserExist.user_id,
      },
    });

    return {
      error: false,
      message: "Article created successfully",
    };
  }
}
