"use client";

import { useState, useEffect, useCallback } from "react";
import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchProductById } from "@/queries/single-product";
import { useUpdateProduct } from "@/queries/update-product";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";

import { IoMdInformationCircle } from "react-icons/io";

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
    monetizationMethods: [],
    averageViews: "",
    images: [],
  };

  const monetizationOptions = [
    { value: "Ad sales", label: "Ad sales / Sponsored posts" },
    { value: "Affiliate marketing", label: "Affiliate marketing" },
    { value: "Own products", label: "Own products / services" },
    { value: "Paid community", label: "Paid community / subscriptions" },
    { value: "Lead generation", label: "Lead generation" },
    { value: "Brand partnerships", label: "Brand partnerships" },
    { value: "Course selling", label: "Courses / digital products" },
    { value: "Dropshipping", label: "Dropshipping / e-commerce" },
    { value: "Donations", label: "Donations / tips" },
    { value: "Traffic redirection", label: "Traffic redirection" },
    { value: "CPA offers", label: "CPA / performance marketing" },
    { value: "Telegram ads", label: "Telegram Ads platform" },
  ];

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

  const handleMultipleOptions = (selected) => {
    setFormData((prev) => ({
      ...prev,
      monetizationMethods: selected ? selected.map((s) => s.value) : [],
    }));
  };

  const selectedValues = monetizationOptions.filter((opt) =>
    formData.monetizationMethods.includes(opt.value),
  );

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
    form.append("averageViews", formData.averageViews);

    formData.monetizationMethods.forEach((method) => {
      form.append("monetizationMethods", method);
    });

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
                    <option value="Hindi">Hindi</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Russian">Russian</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="Turkish">Turkish</option>
                    <option value="Bengali">Bengali</option>

                    <option value="Multi-language">Multi-language</option>
                    <option value="Other">Other</option>
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

                    <option value="Multiple times daily">
                      Multiple times daily
                    </option>
                    <option value="Daily">Daily</option>
                    <option value="3–5 times per week">
                      3–5 times per week
                    </option>
                    <option value="1–2 times per week">
                      1–2 times per week
                    </option>
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-weekly">Bi-weekly</option>
                    <option value="Monthly">Monthly</option>
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
                  <label className="form-label d-flex align-items-center gap-1">
                    Engagement Rate
                    <button
                      type="button"
                      className="text-primary"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Engagement rate measures how actively your audience interacts with content (views, likes, comments). Higher engagement means a more active and valuable audience."
                    >
                      <IoMdInformationCircle size={20} />
                    </button>
                  </label>

                  <select
                    className="common-input"
                    name="engagementRate"
                    value={formData.engagementRate}
                    onChange={handleChange}
                  >
                    <option value="">Select Engagement Rate</option>
                    <option value="<5%">Less than 5%</option>
                    <option value="5–10%">5–10%</option>
                    <option value="10–20%">10–20%</option>
                    <option value="20%+">20%+</option>
                  </select>
                </div>

                {/* MONETIZATION METHODS */}
                <div className="col-sm-6">
                  <label className="form-label">Monetization Methods</label>
                  <Select
                    isMulti
                    name="monetizationMethods"
                    options={monetizationOptions}
                    value={selectedValues}
                    onChange={handleMultipleOptions}
                    closeMenuOnSelect={false}
                    className="react-select"
                  />
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
