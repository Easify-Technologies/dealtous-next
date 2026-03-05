"use client";

import { useState } from "react";
import Link from "next/link";

import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchProducts } from "@/queries/fetch-products";

import Preloader from "@/helper/Preloader";

const AllProduct = () => {
  const [activeButton, setActiveButton] = useState("grid-view");
  const [filterSidebar, setFilterSidebar] = useState(false);
  const [page, setPage] = useState(0);

  const [filters, setFilters] = useState({
    name: "",
    price: "",
    categoryId: null,
  });

  const { data: categories } = useFetchCategories();
  const { data: products, isPending } = useFetchProducts();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  if (isPending) return <Preloader />;

  return (
    <section
      className={`all-product padding-y-120 ${
        activeButton === "list-view" ? "list-view" : ""
      }`}
    >
      <div className="container container-two">
        <div className="row">
          {/* ================= TOP FILTER BAR ================= */}
          <div className="col-lg-12">
            <div className="filter-tab gap-3 flx-between">
              <button
                type="button"
                className="filter-tab__button btn btn-outline-light pill d-flex align-items-center"
                onClick={() => setFilterSidebar(true)}
              >
                <span className="icon icon-left">
                  <img src="assets/images/icons/filter.svg" alt="" />
                </span>
                <span className="font-18 fw-500">Filters</span>
              </button>

              <ul className="nav common-tab nav-pills mb-0 gap-lg-2 gap-1 ms-lg-auto">
                <li className="nav-item">
                  <button className="nav-link active">All Item</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Best Rating</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Best Offers</button>
                </li>
                <li className="nav-item">
                  <button className="nav-link">Best Selling</button>
                </li>
              </ul>

              <div className="list-grid d-flex align-items-center gap-2">
                <button
                  className={`list-grid__button list-button d-sm-flex d-none ${
                    activeButton === "list-view" ? "active" : ""
                  }`}
                  onClick={() => setActiveButton("list-view")}
                >
                  <i className="las la-list" />
                </button>
                <button
                  className={`list-grid__button grid-button d-sm-flex d-none ${
                    activeButton === "grid-view" ? "active" : ""
                  }`}
                  onClick={() => setActiveButton("grid-view")}
                >
                  <i className="las la-border-all" />
                </button>
              </div>
            </div>

            {/* ================= FILTER FORM ================= */}
            <form className="filter-form pb-4 d-block">
              <div className="row gy-3">
                <div className="col-sm-4">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={filters.name}
                    onChange={handleInputChange}
                    className="common-input"
                    placeholder="Search by name"
                  />
                </div>

                <div className="col-sm-4">
                  <label className="form-label">Max Price</label>
                  <input
                    type="text"
                    name="price"
                    value={filters.price}
                    onChange={handleInputChange}
                    className="common-input"
                    placeholder="e.g. 5000"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="col-xl-3 col-lg-4">
            <div className={`filter-sidebar ${filterSidebar ? "show" : ""}`}>
              <button
                className="filter-sidebar__close d-lg-none"
                onClick={() => setFilterSidebar(false)}
              >
                ✕
              </button>

              <div className="filter-sidebar__item">
                <h6>Categories</h6>
                <ul className="filter-sidebar-list">
                  <li>
                    <button
                      className="text-black-three"
                      onClick={() =>
                        setFilters((f) => ({ ...f, categoryId: null }))
                      }
                    >
                      All Categories
                    </button>
                  </li>

                  {categories?.map((cat) => (
                    <li key={cat.id}>
                      <button
                        className="text-black-three"
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            categoryId: cat.id,
                          }))
                        }
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ================= PRODUCT GRID ================= */}
          <div className="col-xl-9 col-lg-8">
            <div className="row gy-4 list-grid-wrapper">
              {products?.map((item) => {
                return (
                  <div
                    key={item?.id}
                    className={
                      activeButton === "list-view"
                        ? "col-12"
                        : "col-xl-4 col-sm-6"
                    }
                  >
                    <div
                      className={`product-item section-bg ${
                        activeButton === "list-view" ? "product-item-list" : ""
                      }`}
                    >
                      <div className="product-item__thumb d-flex">
                        <Link
                          href={`/product-details?product_id=${item?.id}`}
                          className="w-100"
                        >
                          <img
                            src={item.images?.[0] || "/placeholder.png"}
                            alt={item?.name}
                            className="cover-img"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      <div className="product-item__content">
                        <h6 className="product-item__title">
                          <Link href={`/product-details?product_id=${item?.id}`}>
                            {item?.name}
                          </Link>
                        </h6>

                        <p className="font-14">{item?.summary}</p>

                        <h6 className="product-item__price">
                          {item?.currency === "USD"
                            ? `$${item?.price}`
                            : `INR ${item?.price}`}
                        </h6>

                        <div className="product-item__bottom flx-between gap-2">
                          <Link
                            href={`/product-details?product_id=${item?.id}`}
                            className="btn btn-outline-light btn-sm pill"
                          >
                            Quick View
                          </Link>
                          <Link
                            href="#"
                            className="btn btn-outline-light btn-sm pill"
                          >
                            Start Purchase
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= PAGINATION ================= */}
            <nav className="mt-4 d-flex justify-content-between">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Prev
              </button>

              <button disabled={page + 1} onClick={() => setPage((p) => p + 1)}>
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProduct;
