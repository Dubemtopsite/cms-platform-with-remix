import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  layout("routes/editor/layout.tsx", [
    route("editor", "routes/editor/index.tsx"),
    route("editor/new", "routes/editor/new.tsx"),
    route("editor/category", "routes/editor/category.tsx"),
  ]),

  /* API */
  ...prefix("api", [
    route("manage-category", "routes/api/manage-category.tsx"),
    route("delete-category", "routes/api/delete-category.tsx"),
    route("fetch-blog-content", "routes/api/fetch-blog-content.tsx"),
    route("manage-blog-article", "routes/api/manage-blog-article.tsx"),
  ]),
] satisfies RouteConfig;
