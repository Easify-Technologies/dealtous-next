"use client";

import React, { useState } from "react";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries";

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      icon
      parent {
        id
      }
      langs {
        code
        name
        summary
        isPrimary
      }
    }
  }
`;

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    icon: "",
    parentId: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: categoryData } = useQuery(GET_CATEGORIES, {
    variables: {
      offset: 0,
      length: 100
    },
    fetchPolicy: "network-only",
  });

  const [createCategory, { loading }] = useMutation(CREATE_CATEGORY_MUTATION, {
    onCompleted: () => {
      setSuccessMessage("Category created successfully");
      setFormData({
        name: "",
        summary: "",
        icon: "",
        parentId: "",
      });
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    await createCategory({
      variables: {
        input: {
          icon: formData.icon || null,
          parentId: formData.parentId || null,
          langs: [
            {
              code: "en",
              name: formData.name,
              summary: formData.summary,
              isPrimary: true,
            },
          ],
        },
      },
    });
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
                      value={formData.name}
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
                      value={formData.summary}
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
                      value={formData.icon}
                      onChange={handleChange}
                      placeholder="Icon URL or icon class"
                    />
                  </div>
                  <div className="col-sm-6 col-xs-12">
                    <label htmlFor="parentId" className="form-label">
                      Parent Category
                    </label>
                    <select
                      className="common-input common-input--md border--color-dark bg--white"
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleChange}
                    >
                      <option value="">No Parent (Root Category)</option>
                      {categoryData?.categories?.results.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.langs[0]?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-12 col-xs-12">
                    {errorMessage && (
                      <p className="text-danger font-14">{errorMessage}</p>
                    )}

                    {/* SUCCESS */}
                    {successMessage && (
                      <p className="text-success font-14">{successMessage}</p>
                    )}
                  </div>
                  <div className="col-sm-12 col-xs-12">
                    {/* SUBMIT */}
                    <button
                      className="btn btn-main w-100"
                      disabled={loading}
                      onClick={handleSubmit}
                    >
                      {loading ? "Creating..." : "Create Category"}
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
