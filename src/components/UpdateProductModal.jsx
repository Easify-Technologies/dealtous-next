"use client";

import { useState, useEffect, useCallback } from "react";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchProductById } from "@/queries/single-product";
import { useUpdateProduct } from "@/queries/update-product";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

const UpdateProductModal = ({ activeModal, closeModal, selectedProduct }) => {
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

  const [formData, setFormData] = useState(initialState);
  const productId = selectedProduct?.id;

  const { data: categories } = useFetchCategories();
  const { data: product } = useFetchProductById(productId);
  const { mutate, isPending } = useUpdateProduct();

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

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      fileType: "image/webp",
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  };

  const handleUpdate = useCallback(async () => {
    const form = new FormData();

    form.append("name", formData.name);
    form.append("summary", formData.summary);
    form.append("price", formData.price);
    form.append("category", formData.category);
    form.append("currency", formData.currency);
    form.append("subscribers", formData.subscribers);
    form.append("engagementRate", formData.engagementRate);
    form.append("language", formData.language);
    form.append("postingFrequency", formData.postingFrequency);
    form.append("monetizationMethods", formData.monetizationMethods);
    form.append("averageViews", formData.averageViews);

    const compressedImages = await Promise.all(
      (formData.images || [])
        .filter((file) => file instanceof File)
        .map((file) => compressImage(file)),
    );

    compressedImages.forEach((file) => {
      form.append("images", file);
    });

    mutate(
      {
        formData: form,
        productId,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message || "Product updated successfully");
          setTimeout(() => {
            closeModal();
          }, 2000);
        },
        onError: (err) => {
          toast.error(err?.error || "Product cannot be updated");
        },
      },
    );
  }, [formData, productId, mutate]);

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
        images: product.images || [],
      });
    }
  }, [product]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`modal-backdrop fade ${activeModal === "edit" ? "show" : ""}`}
        onClick={closeModal}
      ></div>

      {/* Modal */}
      <div
        className={`modal fade ${
          activeModal === "edit" ? "show d-block" : "d-block"
        }`}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title fw-semibold">Update this Product</h5>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row gy-3">
                {/* NAME */}
                <div className="col-sm-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                    value={formData.price}
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
                    value={formData.currency}
                    onChange={handleChange}
                    className="common-input"
                  />
                </div>

                {/* CATEGORIES */}
                <div className="col-sm-6">
                  <label className="form-label">Categories</label>
                  <select
                    name="category"
                    value={formData.category}
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
                    value={formData.language}
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
                    value={formData.postingFrequency}
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
                    value={formData.subscribers}
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
                    value={formData.engagementRate}
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
                    value={formData.monetizationMethods}
                    onChange={handleChange}
                  >
                    <option value="">Select Monetization Methods</option>
                    <option value="Ad sales">Ad sales</option>
                    <option value="Affiliate marketing">
                      Affiliate marketing
                    </option>
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
                    value={formData.averageViews}
                    onChange={handleChange}
                    className="common-input"
                  />
                </div>

                {/* IMAGES */}
                <div className="col-sm-12">
                  <label className="form-label">Upload Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="common-input"
                    onChange={handleImageChange}
                  />
                </div>

                {/* SUMMARY */}
                <div className="col-sm-12">
                  <label className="form-label">Summary</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    className="common-input"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-success"
                onClick={handleUpdate}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateProductModal;
