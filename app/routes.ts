import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  layout("routes/editor/layout.tsx", [
    route("editor", "routes/editor/index.tsx"),
    route("editor/new", "routes/editor/new.tsx"),
    route("editor/category", "routes/editor/category.tsx"),
  ]),

  route("preview-blog/:blogId", "routes/preview-blog.tsx"),

  /* API */
  ...prefix("api", [
    route("manage-category", "routes/api/manage-category.tsx"),
    route("delete-category", "routes/api/delete-category.tsx"),
    route("fetch-blog-content/:blogId", "routes/api/fetch-blog-content.tsx"),
    route("manage-blog-article", "routes/api/manage-blog-article.tsx"),
    route("delete-article", "routes/api/delete-article.tsx"),
  ]),
] satisfies RouteConfig;
