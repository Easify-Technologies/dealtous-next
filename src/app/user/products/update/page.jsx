import { Suspense } from "react";
import Preloader from "@/helper/Preloader";
import UpdateProductPage from "@/components/UpdateProductPage";

export default function Page() {
  return (
    <Suspense fallback={<Preloader />}>
      <UpdateProductPage />
    </Suspense>
  );
}