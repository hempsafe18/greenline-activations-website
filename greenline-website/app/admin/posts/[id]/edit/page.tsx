export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: "_" }];
}

import EditPostClient from "./EditPostClient";

export default function EditPostPage() {
  return <EditPostClient />;
}
