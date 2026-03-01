"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

import { GET_CATEGORY_BY_ID, GET_CATEGORIES } from "../graphql/queries";

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
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

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

const UpdateCategory = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("category_id") || "";

  const {
    data,
    loading,
    error,
  } = useQuery(GET_CATEGORY_BY_ID, {
    variables: { id },
    skip: !id,
    fetchPolicy: "network-only",
  });

  const { data: allCategories } = useQuery(GET_CATEGORIES, {
    variables: { offset: 0, length: 100 },
  });

  const [updateCategory, { loading: updating }] =
    useMutation(UPDATE_CATEGORY_MUTATION);

  const [deleteCategory] =
    useMutation(DELETE_CATEGORY_MUTATION);

  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    icon: "",
    parentId: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  /* ----------------------------
     Populate Form From Backend
  ----------------------------- */
  useEffect(() => {
    if (!data?.category) return;

    const lang =
      data.category.langs.find((l) => l.isPrimary) ||
      data.category.langs[0];

    setFormData({
      name: lang?.name || "",
      summary: lang?.summary || "",
      icon: data.category.icon || "",
      parentId: data.category.parent?.id || "",
    });
  }, [data]);

  /* ----------------------------
     Handlers
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!id) return;

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await updateCategory({
        variables: {
          id,
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

      setSuccessMessage("Category updated successfully");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await deleteCategory({ variables: { id } });
      router.push("/admin/categories");
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading category</p>;

  return (
    <section className="padding-y-120">
      <div className="container">
        <h4 className="mb-4">Update Category</h4>

        <input
          className="common-input mb-3"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Category Name"
        />

        <input
          className="common-input mb-3"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="Summary"
        />

        <input
          className="common-input mb-3"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="Icon URL"
        />

        <select
          className="common-input mb-4"
          name="parentId"
          value={formData.parentId}
          onChange={handleChange}
        >
          <option value="">No Parent (Root)</option>

          {allCategories?.categories?.results
            ?.filter((cat) => cat.id !== id)
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.langs?.[0]?.name}
              </option>
            ))}
        </select>

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
          {updating ? "Updating..." : "Update Category"}
        </button>

        <button
          className="btn btn-danger w-100"
          onClick={handleDelete}
        >
          Delete Category
        </button>
      </div>
    </section>
  );
};

export default UpdateCategory;