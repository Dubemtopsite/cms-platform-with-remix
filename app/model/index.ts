export interface BlogCategoryItemModel {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  categoryName: string;
  categorySlug: string;
}

export interface BlogArticleModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  title: string;
  content: string;
  slug: string;
  userId: string;
}

export type BlogArticleItemProps = BlogArticleModel & {
  user: {
    createdAt: Date;
    updatedAt: Date;
    user_id: string;
    email: string;
    supabaseUid: string;
  };
  category: BlogCategoryItemModel;
};
