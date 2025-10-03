import type { Route } from "./+types/fetch-blog-content";

export async function loader({ params }: Route.ActionArgs) {
  console.log(params);
  return {};
}
