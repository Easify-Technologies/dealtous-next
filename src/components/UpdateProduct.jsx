"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { gql } from "@apollo/client";
import { GET_CATEGORIES } from "../graphql/queries";

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      price
      currency
      images
      langs {
        code
        name
        summary
        isPrimary
      }
    }
  }
`;

const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const GET_PRODUCT_BY_ID = gql`
  query Product($id: ID!) {
    product(id: $id) {
      id
      price
      currency
      images
      langs(codes: ["en"]) {
        name
        summary
        isPrimary
      }
      categories {
        id
      }
    }
  }
`;

const UpdateProduct = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("product_id") || "";

  const {
    data,
    loading: productLoading,
    error: productError,
  } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const { data: categoryData } = useQuery(GET_CATEGORIES, {
    variables: { offset: 0, length: 100 },
  });

  const [updateProduct, { loading: updating }] =
    useMutation(UPDATE_PRODUCT_MUTATION);

  const [deleteProduct] = useMutation(DELETE_PRODUCT_MUTATION);

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    price: "",
    currency: "USD",
    images: [],
    categoryIds: [],
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ---------------------------
     Populate Form From Backend
  ---------------------------- */
  useEffect(() => {
    if (!data?.product) return;

    const lang =
      data.product.langs.find((l) => l.isPrimary) ||
      data.product.langs[0];

    setFormData({
      name: lang?.name || "",
      summary: lang?.summary || "",
      price: data.product.price || "",
      currency: data.product.currency || "USD",
      images: data.product.images || [],
      categoryIds: data.product.categories.map((c) => c.id),
    });
  }, [data]);

  /* ---------------------------
     Handlers
  ---------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleCategory = (categoryId) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter((id) => id !== categoryId)
        : [...prev.categoryIds, categoryId],
    }));
  };

  const handleUpdate = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("");

      await updateProduct({
        variables: {
          id,
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

      setSuccessMessage("Product updated successfully");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct({ variables: { id } });
      router.push("/admin/products");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (productLoading) return <p>Loading...</p>;
  if (productError) return <p>Error loading product</p>;

  return (
    <section className="padding-y-120">
      <div className="container">
        <h4 className="mb-4">Update Product</h4>

        <input
          className="common-input mb-3"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
        />

        <input
          className="common-input mb-3"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Summary"
        />

        <input
          type="number"
          className="common-input mb-3"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
        />

        <input
          className="common-input mb-3"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          placeholder="Currency"
        />

        <div className="mb-4">
          <h6>Categories</h6>
          {categoryData?.categories?.results?.map((cat) => (
            <label key={cat.id} className="d-block">
              <input
                type="checkbox"
                checked={formData.categoryIds.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />{" "}
              {cat.langs?.[0]?.name}
            </label>
          ))}
        </div>

        {errorMessage && (
          <p className="text-danger">{errorMessage}</p>
        )}
        {successMessage && (
          <p className="text-success">{successMessage}</p>
        )}

        <button
          className="btn btn-main w-100 mb-3"
          disabled={updating}
          onClick={handleUpdate}
        >
          {updating ? "Updating..." : "Update Product"}
        </button>

        <button
          className="btn btn-danger w-100"
          onClick={handleDelete}
        >
          Delete Product
        </button>
      </div>
    </section>
  );
};

export default UpdateProduct;