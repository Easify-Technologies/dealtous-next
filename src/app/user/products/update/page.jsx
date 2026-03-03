"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

import { useFetchCategories } from "../../../../queries/fetch-categories";
import { useFetchProductById } from "../../../../queries/single-product";
import { useUpdateProduct } from "../../../../queries/update-product";
import { useRemoveProduct } from "../../../../queries/remove-product";

import Preloader from "../../../../helper/Preloader";

const page = () => {
  const initialState = {
    name: "",
    summary: "",
    price: "",
    currency: "USD",
    category: "",
    images: [],
  };

  const params = useSearchParams();
  const productId = params.get("product_id") ?? "";

  const [formData, setFormData] = useState(initialState);

  const { name, summary, price, currency, category, images } = formData;
  const { data: categories } = useFetchCategories();
  const { data: product, isPending: productPending } = useFetchProductById(productId);
  const { mutate, isPending, isSuccess, data, error } = useUpdateProduct();
  const { mutate: deleteProduct } = useRemoveProduct();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleUpdateProduct = useCallback(() => {
    const form = new FormData();

    form.append("name", name);
    form.append("summary", summary);
    form.append("price", price);
    form.append("category", category);
    form.append("currency", currency);

    images.forEach((file) => {
      form.append("images", file);
    });

    mutate({
      formData: form,
      productId,
    });
  }, [formData, productId, mutate]);

  const handleDeleteProduct = () => {
    deleteProduct(productId);
  };

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        summary: product.summary || "",
        price: product.price || "",
        currency: product.currency || "",
        category: product.category || "",
      });
    }
  }, [product]);

  if (productPending) return <Preloader />;

  return (
    <div className="dashboard-body__content">
      <div className="card common-card">
        <div className="card-header">
          <h6 className="title">Update Product</h6>
        </div>

        <div className="card-body">
          <div className="row gy-3">
            {/* NAME */}
            <div className="col-sm-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* SUMMARY */}
            <div className="col-sm-6">
              <label className="form-label">Summary</label>
              <input
                type="text"
                name="summary"
                value={summary}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* PRICE */}
            <div className="col-sm-6">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* CURRENCY */}
            <div className="col-sm-6">
              <label className="form-label">Currency</label>
              <input
                type="text"
                name="currency"
                value={currency}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* CATEGORIES */}
            <div className="col-sm-6">
              <label className="form-label">Categories</label>
              <select
                name="category"
                value={category}
                className="common-input"
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGES */}
            <div className="col-sm-6">
              <label className="form-label">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="common-input"
                onChange={handleImageChange}
              />
            </div>

            {/* MESSAGES */}
            <div className="col-12">
              {isSuccess && data.message && (
                <p className="text-success mb-2">{data.message}</p>
              )}

              {error && <p className="text-danger mb-2">{error.message}</p>}
            </div>

            {/* SUBMIT */}
            <div className="col-12">
              <button
                type="button"
                className="btn btn-main w-100"
                onClick={handleUpdateProduct}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update Product"}
              </button>
            </div>
            <div className="col-12">
              <button
                onClick={handleDeleteProduct}
                type="button"
                className="btn btn-danger w-100"
              >
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
