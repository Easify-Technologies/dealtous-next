import { Suspense } from "react";
import UpdateProductPage from "./UpdateProductPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateProductPage />
    </Suspense>
  );
}