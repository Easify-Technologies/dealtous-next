"use client";

import { useState } from "react";

import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CATEGORIES } from "../graphql/queries";

const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      price
      currency
      langs {
        code
        name
        summary
        isPrimary
      }
    }
  }
`;

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

  const { data: categoryData, loading: categoriesLoading } = useQuery(
    GET_CATEGORIES,
    {
      variables: {
        offset: 0,
        length: 100,
      },
      fetchPolicy: "network-only",
    },
  );

  const [createProduct, { loading }] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      setSuccessMessage("Product created successfully");
      setFormData(initialState);
    },
    onError: (error) => {
      setErrorMessage(error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setFormData((prev) => ({
      ...prev,
      categoryIds: values,
    }));
  };

  const handleImageUpload = async (e) => {
    try {
      const files = Array.from(e.target.files);
      if (!files.length) return;

      const uploadForm = new FormData();
      files.forEach((file) => uploadForm.append("files", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      if (!res.ok) {
        throw new Error("Image upload failed");
      }

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...data.urls],
      }));
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  /* ------------------------------
     Validation
  ------------------------------ */
  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required";
    if (!formData.price) return "Price is required";
    if (isNaN(Number(formData.price))) return "Price must be a number";
    if (formData.categoryIds.length === 0)
      return "Select at least one category";

    return null;
  };

  /* ------------------------------
     Submit
  ------------------------------ */
  const handleSubmit = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    await createProduct({
      variables: {
        input: {
          price: Number(formData.price),
          currency: formData.currency,
          images: formData.images,
          categoryIds: formData.categoryIds,
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
                onChange={handleCategoryChange}
                className="common-input"
              >
                {categoriesLoading && <option>Loading...</option>}
                {categoryData?.categories?.results.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.langs[0]?.name}
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
                onChange={handleImageUpload}
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
                disabled={loading}
                onClick={handleSubmit}
                className="btn btn-main w-100"
              >
                {loading ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
