"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

import { useFetchCategories } from "@/queries/fetch-categories";
import { useFetchProducts } from "@/queries/fetch-products";
import { useFetchBuyerOrders } from "@/queries/buyer-orders";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import Preloader from "@/helper/Preloader";
import { IoRibbonOutline } from "react-icons/io5";

const AllProduct = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const userId = session?.user?.id ?? "";
  const role = session?.user?.role ?? "";

  const [activeButton, setActiveButton] = useState("grid-view");
  const [filterSidebar, setFilterSidebar] = useState(false);
  const [page, setPage] = useState(0);

  const { data: categories } = useFetchCategories();
  const { data: products, isPending } = useFetchProducts();
  const { data: buyerOrders } = useFetchBuyerOrders(userId);

  const PAGE_SIZE = 6;

  const [filters, setFilters] = useState({
    name: "",
    price: "",
    categoryId: null,
    sortBy: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };

  const isPublished = (product) => product.status === "PUBLISHED";
  const isSold = (product) => product.isSold === false;

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    let result = products.filter(isPublished).filter(isSold).filter((product) => {
      const nameMatch =
        !filters.name ||
        product.name.toLowerCase().includes(filters.name.toLowerCase());

      const priceMatch =
        !filters.price || product.price <= Number(filters.price);

      const categoryMatch =
        !filters.categoryId || product.category === filters.categoryId;

      return nameMatch && priceMatch && categoryMatch;
    });

    switch (filters.sortBy) {
      case "price_low_high":
        result.sort((a, b) => a.price - b.price);
        break;

      case "price_high_low":
        result.sort((a, b) => b.price - a.price);
        break;

      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;

      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;

      default:
        break;
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);

  const paginatedProducts = useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  const handleCheckout = (productId) => {
    router.push(`/checkout?productId=${productId}&userId=${userId}`);
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

              {/* <ul className="nav common-tab nav-pills mb-0 gap-lg-2 gap-1 ms-lg-auto">
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
              </ul> */}

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

                <div className="col-sm-4">
                  <label className="form-label">Sort By</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleInputChange}
                    className="common-input"
                  >
                    <option value="">None</option>
                    <option value="price_low_high">Price: Low to High</option>
                    <option value="price_high_low">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
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
                  {/* All Categories */}
                  <li>
                    <label className="d-flex align-items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.categoryId === null}
                        onChange={() => {
                          setFilters((f) => ({ ...f, categoryId: null }));
                          setPage(0);
                        }}
                      />
                      <span>All Categories</span>
                    </label>
                  </li>

                  {/* Dynamic Categories */}
                  {categories?.map((cat) => (
                    <li key={cat.id}>
                      <label className="d-flex align-items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.categoryId === cat.id}
                          onChange={() => {
                            setFilters((f) => ({
                              ...f,
                              categoryId: cat.id,
                            }));
                            setPage(0);
                          }}
                        />
                        <span>{cat.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ================= PRODUCT GRID ================= */}
          <div className="col-xl-9 col-lg-8">
            <div className="row gy-4 list-grid-wrapper">
              {paginatedProducts?.map((item) => {
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
                      className={`pm-card ${activeButton === "list-view" ? "pm-card--list" : ""}`}
                    >
                      <div className="pm-card__thumb">
                        {item?.status === "PUBLISHED" && (
                          <span className="pm-card__badge">
                            <IoRibbonOutline size={25} />
                            <span className="ms-1 fs-16">Verified</span>
                          </span>
                        )}

                        <Link
                          href={`/product-details?product_id=${item?.id}`}
                          className="pm-card__link"
                        >
                          <img
                            src={item.images?.[0] || "/placeholder.png"}
                            alt={item?.name}
                            className="pm-card__img"
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      <div className="pm-card__content">
                        <h6 className="pm-card__title">
                          <Link
                            href={`/product-details?product_id=${item?.id}`}
                          >
                            {item?.name}
                          </Link>
                        </h6>

                        <p className="pm-card__desc">{item?.summary}</p>

                        <h6 className="pm-card__price">
                          {item?.currency === "USD"
                            ? `$${item?.price}`
                            : `INR ${item?.price}`}
                        </h6>

                        <div className="pm-card__actions">
                          <Link
                            href={`/product-details?product_id=${item?.id}`}
                            className="btn btn-outline-light btn-sm pill"
                          >
                            Quick View
                          </Link>
                          <button
                            onClick={() => handleCheckout(item?.id)}
                            className="btn btn-sm btn-main pill"
                          >
                            Start Purchase
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= PAGINATION ================= */}
            <nav className="mt-5">
              <div className="d-flex justify-content-center align-items-center gap-3">
                <button
                  className="btn btn-outline-light pill px-4 py-2 d-flex align-items-center gap-2"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <i className="las la-arrow-left"></i>
                  Prev
                </button>

                <span className="fw-500 font-16">
                  Page <strong>{page + 1}</strong> of{" "}
                  <strong>{totalPages || 1}</strong>
                </span>

                <button
                  className="btn btn-outline-light pill px-4 py-2 d-flex align-items-center gap-2"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <i className="las la-arrow-right"></i>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllProduct;
