import UpdateProductPage from "@/components/UpdateProductPage";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdateProductPage />
    </Suspense>
  );
}