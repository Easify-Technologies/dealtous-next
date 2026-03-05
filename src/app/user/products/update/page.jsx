import UpdateProductPage from "@/components/UpdateProductPage";
import { Suspense } from "react";
import Preloader from "@/helper/Preloader";

export default function Page() {
  return (
    <Suspense fallback={<Preloader />}>
      <UpdateProductPage />
    </Suspense>
  );
}