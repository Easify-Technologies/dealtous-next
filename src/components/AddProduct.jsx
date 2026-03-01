"use client";

import { useState } from "react";

const AddProduct = () => {
  const initialState = {
    name: "",
    summary: "",
    price: "",
    currency: "USD",
    categoryIds: [],
    images: [],
  };

  const [formData, setFormData] = useState(initialState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="dashboard-body__content">
      <div className="card common-card">
        <div className="card-header">
          <h6 className="title">Add Product</h6>
        </div>

        <div className="card-body">
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

            {/* SUMMARY */}
            <div className="col-sm-6">
              <label className="form-label">Summary</label>
              <input
                type="text"
                name="summary"
                value={formData.summary}
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
                multiple
                value={formData.categoryIds}
                className="common-input"
              >
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
              />
            </div>

            {/* MESSAGES */}
            <div className="col-12">
              {errorMessage && <p className="text-danger">{errorMessage}</p>}
              {successMessage && (
                <p className="text-success">{successMessage}</p>
              )}
            </div>

            {/* SUBMIT */}
            <div className="col-12">
              <button
                type="button"
                className="btn btn-main w-100"
              >
                Create Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
