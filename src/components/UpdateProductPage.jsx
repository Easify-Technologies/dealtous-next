"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Select from "react-select";

import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchProductById } from "@/queries/single-product";
import { useUpdateProduct } from "@/queries/update-product";
import { useRemoveProduct } from "@/queries/remove-product";

import Preloader from "@/helper/Preloader";
import imageCompression from "browser-image-compression";
import { IoMdInformationCircle } from "react-icons/io";
import toast from "react-hot-toast";

const UpdateProductPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const router = useRouter();

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

  const handleMessageModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleDeleteModal = () => {
    setDeleteModal(!deleteModal);
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
  const { data: product, isPending: productPending } =
    useFetchProductById(productId);
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useUpdateProduct();
  const { mutate: deleteProduct, isPending: deletePending } = useRemoveProduct();

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
    monetizationMethods.includes(opt.value),
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

  const handleUpdateProduct = useCallback(async () => {
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
    form.append("averageViews", averageViews);

    monetizationMethods.forEach((method) => {
      form.append("monetizationMethods", method);
    });

    const compressedImages = await Promise.all(
      images.map((file) => compressImage(file)),
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
        onSuccess: () => {
          setTimeout(() => {
            router.push("/user/products");
          }, 2000);
        },
      },
    );
  }, [formData, productId, mutate]);

  const handleDeleteProduct = () => {
    deleteProduct(productId, {
      onSuccess: (data) => {
        toast.success(data.message || "Product delete successfully");
        setTimeout(() => {
          router.push("/user/products");
        }, 2000);
      },
      onError: (data) => {
        toast.error(data.error || "Product cannot be deleted");
      }
    });
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
        images: product.images || [],
      });
    }
  }, [product]);

  useEffect(() => {
    if (isSuccess || isError) {
      const timer = () => {
        setTimeout(() => {
          reset();
        }, 3000);
      };

      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, reset]);

  if (productPending) return <Preloader />;

  return (
    <>
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
                  value={postingFrequency}
                  onChange={handleChange}
                >
                  <option value="">Select Frequency</option>

                  <option value="Multiple times daily">
                    Multiple times daily
                  </option>
                  <option value="Daily">Daily</option>
                  <option value="3–5 times per week">3–5 times per week</option>
                  <option value="1–2 times per week">1–2 times per week</option>
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
                  value={subscribers}
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
                  value={engagementRate}
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
                  value={averageViews}
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
                  value={summary}
                  onChange={handleChange}
                  className="common-input"
                />
              </div>

              {/* SUBMIT */}
              <div className="col-12">
                <button
                  type="button"
                  className="btn btn-main w-100"
                  onClick={handleMessageModal}
                >
                  Update Product
                </button>
              </div>
              <div className="col-12">
                <button
                  onClick={handleDeleteModal}
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

      {/* UPDATE MESSAGE MODAL */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            {/* Header */}
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">
                Are you sure you want to update this product?
              </h5>
              <button
                className="btn-close"
                onClick={handleMessageModal}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row">
                <p className="fw-semibold mb-2">
                  ⚠️ Updating your channel details will require your channel to
                  go through the approval process again. During this time, some
                  features may be temporarily unavailable. Please review your
                  changes before proceeding.
                </p>

                {/* MESSAGES */}
                <div className="col-12">
                  {isSuccess && data.message && (
                    <p className="text-success">{data.message}</p>
                  )}

                  {isError && error && (
                    <p className="text-danger">{error.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer text-end">
              <button
                type="button"
                className="btn btn-main me-2"
                onClick={handleUpdateProduct}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleMessageModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MESSAGE MODAL */}
      {deleteModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            {/* Header */}
            <div className="modal-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0 fw-semibold">
                Are you sure you want to delete this product?
              </h5>
              <button
                className="btn-close"
                onClick={handleDeleteModal}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row">
                <p className="fw-medium mb-2">
                  You are about to <strong>{name}</strong>. This action cannot
                  be undone. All related product details and listing data will
                  be removed permanently.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="modal-footer text-end">
              <button
                type="button"
                className="btn btn-main me-2"
                onClick={handleDeleteProduct}
                disabled={deletePending}
              >
                {deletePending ? "Deleting..." : "Delete"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleDeleteModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateProductPage;
