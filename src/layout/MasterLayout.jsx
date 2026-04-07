"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";

const MasterLayout = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [show, setShow] = useState(false);

  const dashboardControl = () => {
    setActive(!active);
  };

  const showProfileControl = () => {
    setShow(!show);
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  }, [router]);

  useEffect(() => {
    setIsMounted(true);
    const token = localStorage.getItem("adminToken") ?? "";
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  if (!isMounted) return null;

  return (
    <>
      <div className="mobile-menu d-lg-none d-block">
        <button
          type="button"
          className="close-button text-body hover-text-main"
        >
          {" "}
          <i className="las la-times" />{" "}
        </button>
        <div className="mobile-menu__inner">
          <Link scroll={false} href="/" className="mobile-menu__logo">
            <img
              src="../../assets/images/logo/logo.png"
              alt="Logo"
              className="white-version"
              style={{ filter: "invert(100%) hue-rotate(170deg)" }}
            />
            <img
              src="../../assets/images/logo/logo.png"
              alt="Logo"
              className="dark-version"
              style={{ filter: "invert(100%) hue-rotate(170deg)" }}
            />
          </Link>
          <div className="mobile-menu__menu">
            <ul className="nav-menu flx-align nav-menu--mobile">
              <li className="nav-menu__item">
                <Link scroll={false} href="/" className="nav-menu__link">
                  Home
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link
                  scroll={false}
                  href="/all-products"
                  className="nav-menu__link"
                >
                  Products
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link
                  scroll={false}
                  href="/how-it-works"
                  className="nav-menu__link"
                >
                  How it Works
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link scroll={false} href="/about" className="nav-menu__link">
                  About
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link scroll={false} href="/blog" className="nav-menu__link">
                  Blog
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link scroll={false} href="/contact" className="nav-menu__link">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="header-right__inner d-lg-none my-3 gap-1 d-flex flx-align">
              <Link
                scroll={false}
                href="/register"
                className="btn btn-main pill"
              >
                <span className="icon-left icon">
                  <img src="../assets/images/icons/user.svg" alt="" />
                </span>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section
        className={`dashboard ${active && "active"}`}
        onClick={() => show === true && setShow(false)}
      >
        <div className="dashboard__inner d-flex">
          {/* Dashboard Sidebar Start */}
          <div className={`dashboard-sidebar ${active && "active"}`}>
            <button
              type="button"
              className="dashboard-sidebar__close d-lg-none d-flex text-body hover-text-main"
              onClick={dashboardControl}
            >
              <i className="las la-times" />
            </button>
            <div className="dashboard-sidebar__inner">
              <Link scroll={false} href="/" className="logo mb-48">
                <img
                  src="../../assets/images/logo/logo.png"
                  alt=""
                  className="white-version"
                  style={{ filter: "invert(100%) hue-rotate(170deg)" }}
                />
                <img
                  src="../../assets/images/logo/logo.png"
                  alt=""
                  className="dark-version"
                  style={{ filter: "invert(100%) hue-rotate(170deg)" }}
                />
              </Link>
              <Link scroll={false} href="/" className="logo favicon mb-48">
                <img
                  src="../assets/images/icons/cropped-DEALTOUS-1.png"
                  alt=""
                  style={{ width: "50px" }}
                />
              </Link>
              {/* Sidebar List Start */}
              <ul className="sidebar-list">
                <li
                  className={`sidebar-list__item ${pathname == "/admin/dashboard" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/dashboard"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon1.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active1.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Dashboard</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/users" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/users"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon4.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active4.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Users</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/products" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/products"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon3.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active3.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Products</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/categories" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/categories"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon5.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active5.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Categories</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/transactions" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/transactions"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon9.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active9.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Transactions</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/blogs" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="/admin/blogs"
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon12.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active12.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Blogs</span>
                  </Link>
                </li>
                <li
                  className={`sidebar-list__item ${pathname == "/admin/login" && "activePage"}`}
                >
                  <Link
                    scroll={false}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                    }}
                    className="sidebar-list__link"
                  >
                    <span className="sidebar-list__icon">
                      <img
                        src="../assets/images/icons/sidebar-icon13.svg"
                        alt=""
                        className="icon"
                      />
                      <img
                        src="../assets/images/icons/sidebar-icon-active13.svg"
                        alt=""
                        className="icon icon-active"
                      />
                    </span>
                    <span className="text">Logout</span>
                  </Link>
                </li>
              </ul>
              {/* Sidebar List End */}
            </div>
          </div>

          <div className="dashboard-body">
            {/* Dashboard Nav Start */}
            <div className="dashboard-nav bg-white flx-between gap-md-3 gap-2">
              <div className="dashboard-nav__left flx-align gap-md-3 gap-2">
                <button
                  onClick={dashboardControl}
                  type="button"
                  className="icon-btn bar-icon text-heading bg-gray-seven flx-center"
                >
                  <i className="las la-bars" />
                </button>
                <button
                  onClick={dashboardControl}
                  type="button"
                  className="icon-btn arrow-icon text-heading bg-gray-seven flx-center"
                >
                  <img src="../assets/images/icons/angle-right.svg" alt="" />
                </button>
                <div className="search-input d-sm-block d-none">
                  <span className="icon">
                    <img
                      src="../assets/images/icons/search-dark.svg"
                      alt=""
                      className="white-version"
                    />
                    <img
                      src="../assets/images/icons/search-dark-white.svg"
                      alt=""
                      className="dark-version"
                    />
                  </span>
                  <input
                    type="text"
                    className="common-input common-input--md common-input--bg pill w-100"
                    placeholder="Search here..."
                  />
                </div>
              </div>
              <div className="dashboard-nav__right">
                <div className="header-right flx-align">
                  <div className="header-right__inner gap-sm-3 gap-2 flx-align d-flex">
                    {/* Light Dark Mode */}
                    <ThemeToggle />
                    <div className="user-profile">
                      <button
                        className="user-profile__button flex-align"
                        onClick={showProfileControl}
                      >
                        <span className="user-profile__thumb">
                          <img
                            src="../assets/images/icons/software-admin.png"
                            className="cover-img"
                            alt="admin"
                          />
                        </span>
                      </button>
                      <ul
                        className={`user-profile-dropdown ${show && "show"} `}
                      >
                        <li className="sidebar-list__item">
                          <Link
                            scroll={false}
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleLogout();
                            }}
                            className="sidebar-list__link"
                          >
                            <span className="sidebar-list__icon">
                              <img
                                src="../assets/images/icons/sidebar-icon13.svg"
                                alt=""
                                className="icon"
                              />
                              <img
                                src="../assets/images/icons/sidebar-icon-active13.svg"
                                alt=""
                                className="icon icon-active"
                              />
                            </span>
                            <span className="text">Logout</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* children */}
            {children}
            {/* Dashboard Footer */}
            <div className="dashboard-footer bottom-footer-two mt-32 border-0 bg-white">
              <div className="bottom-footer__inner flx-between gap-3">
                <p className="bottom-footer__text font-14">
                  {" "}
                  Copyright © 2026 Dealtous, All rights reserved.
                </p>
                <div className="footer-links gap-4">
                  <Link
                    scroll={false}
                    href="/terms-conditions"
                    className="footer-link hover-text-heading font-14"
                  >
                    Terms of service
                  </Link>
                  <Link
                    scroll={false}
                    href="/privacy-policy"
                    className="footer-link hover-text-heading font-14"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    scroll={false}
                    href="/cancellation-refund-policy"
                    className="footer-link hover-text-heading font-14"
                  >
                    Cancellation & Refund Policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MasterLayout;
