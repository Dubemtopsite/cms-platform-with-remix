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
