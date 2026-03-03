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
    subscribers: "",
    engagementRate: "",
    language: "",
    postingFrequency: "",
    monetizationMethods: "",
    averageViews: "",
    images: [],
  };

  const params = useSearchParams();
  const productId = params.get("product_id") ?? "";

  const [formData, setFormData] = useState(initialState);

  const {
    name,
    summary,
    price,
    currency,
    category,
    images,
    subscribers,
    engagementRate,
    language,
    postingFrequency,
    monetizationMethods,
    averageViews,
  } = formData;
  
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
    form.append("subscribers", subscribers);
    form.append("engagementRate", engagementRate);
    form.append("language", language);
    form.append("postingFrequency", postingFrequency);
    form.append("monetizationMethods", monetizationMethods);
    form.append("averageViews", averageViews);

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
        subscribers: product.subscribers || "",
        engagementRate: product.engagementRate || "",
        averageViews: product.averageViews || "",
        language: product.language || "",
        postingFrequency: product.postingFrequency || "",
        monetizationMethods: product.monetizationMethods || "",
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

            {/* LANGUAGE */}
            <div className="col-sm-6">
              <label className="form-label">Main Language</label>
              <select
                name="language"
                id="language"
                className="common-input"
                value={language}
                onChange={handleChange}
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="Russia">Russia</option>
              </select>
            </div>

            {/* POSTING FREQUENCY */}
            <div className="col-sm-6">
              <label className="form-label">Posting Frequency</label>
              <select
                name="postingFrequency"
                id="postingFrequency"
                className="common-input"
                value={postingFrequency}
                onChange={handleChange}
              >
                <option value="">Select Frequency</option>
                <option value="Daily, 3–4 times/week">
                  Daily, 3–4 times/week
                </option>
                <option value="Weekly">Weekly</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>

            {/* SUBSCRIBERS */}
            <div className="col-sm-6">
              <label className="form-label">Subscribers Count</label>
              <input
                type="text"
                name="subscribers"
                value={subscribers}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* ENGAGEMENT RATE */}
            <div className="col-sm-6">
              <label className="form-label">Engagement Rate</label>
              <input
                type="text"
                name="engagementRate"
                value={engagementRate}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* MONETIZATION METHODS */}
            <div className="col-sm-6">
              <label className="form-label">Monetization Methods</label>
              <select
                name="monetizationMethods"
                id="monetizationMethods"
                className="common-input"
                value={monetizationMethods}
                onChange={handleChange}
              >
                <option value="">Select Monetization Methods</option>
                <option value="Ad sales">Ad sales</option>
                <option value="Affiliate marketing">Affiliate marketing</option>
                <option value="Own products">Own products</option>
                <option value="Paid community">Paid community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* AVERAGE VIEWS */}
            <div className="col-sm-6">
              <label className="form-label">Average Views</label>
              <input
                type="text"
                name="averageViews"
                value={averageViews}
                onChange={handleChange}
                className="common-input"
              />
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
