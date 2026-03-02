"use client";

import React, { useState } from "react";
import { useAddCategory } from "../queries/add-category";

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    icon: "",
  });
  
  const { name, summary, icon } = formData;
  const { mutate, isPending, data, error, isSuccess } = useAddCategory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
   mutate({ name, summary, icon });
  };

  return (
    <>
      <div className="dashboard-body__content">
        <div className="card common-card">
          <div className="card-body">
            <div className="card common-card border border-gray-five overflow-hidden mb-24">
              <div className="card-header">
                <h6 className="title">Add Category</h6>
              </div>
              <div className="card-body">
                <div className="row gy-3">
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    <input
                      type="text"
                      className="common-input common-input--md border--color-dark bg--white"
                      id="name"
                      name="name"
                      value={name}
                      onChange={handleChange}
                      placeholder="Category Name"
                    />
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="summary" className="form-label">
                      Summary
                    </label>
                    <input
                      type="text"
                      id="summary"
                      name="summary"
                      className="common-input common-input--md border--color-dark bg--white"
                      value={summary}
                      onChange={handleChange}
                      placeholder="Short Summary"
                    />
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="icon" className="form-label">
                      Icon
                    </label>
                    <input
                      type="text"
                      name="icon"
                      id="icon"
                      className="common-input common-input--md border--color-dark bg--white"
                      value={icon}
                      onChange={handleChange}
                      placeholder="Icon URL or icon class"
                    />
                  </div>
                  <div className="col-sm-12 col-xs-12">
                   {isSuccess && data.message && (
                    <p className="text-success mb-2">{data.message}</p>
                   )}

                   {error && (
                    <p className="text-danger mb-2">{error.message}</p>
                   )}
                  </div>
                  <div className="col-sm-12 col-xs-12">
                    {/* SUBMIT */}
                    <button
                      type="button"
                      className="btn btn-main w-100"
                      onClick={handleSubmit}
                      disabled={isPending}
                    >
                      {isPending ? "Creating..." : "Create Category"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;
