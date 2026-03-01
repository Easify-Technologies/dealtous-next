"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HeaderOne = () => {
  let pathname = usePathname();

  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    var offCanvasNav = document.getElementById("offcanvas-navigation");
    var menuExpand = offCanvasNav.querySelectorAll(
      ".has-submenu > .nav-menu__link"
    );
    var numMenuExpand = menuExpand.length;

    function sideMenuExpand() {
      if (this.parentElement.classList.contains("active") === true) {
        this.parentElement.classList.remove("active");
      } else {
        for (let i = 0; i < numMenuExpand; i++) {
          menuExpand[i].parentElement.classList.remove("active");
        }
        this.parentElement.classList.add("active");
      }
    }

    for (let i = 0; i < numMenuExpand; i++) {
      menuExpand[i].addEventListener("click", sideMenuExpand);
    }

  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset < 150) {
        setScroll(false);
      } else {
        setScroll(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const mobileMenu = () => {
    setActive(!active);
  };

  return (
    <>
      <div className="overlay"></div>
      <div className={`side-overlay ${active && "show"}`}></div>
      {/* ==================== Header Start Here ==================== */}
      <header className={`header ${scroll ? "fixed-header" : ""} `}>
        <div className="container container-full">
          <nav className="header-inner flx-between">
            {/* Logo Start */}
            <div className="logo">
              <Link scroll={false} href="/" className="link white-version" style={{ filter: "invert(100%) hue-rotate(170deg)" }}>
                <img src="assets/images/logo/logo.png" alt="Logo" />
              </Link>
              <Link scroll={false} href="/" className="link dark-version">
                <img src="assets/images/logo/logo.png" alt="Logo" />
              </Link>
            </div>
            {/* Logo End  */}
            {/* Menu Start  */}
            <div className="header-menu d-lg-block d-none">
              <ul className="nav-menu flx-align">
                <li className="nav-menu__item">
                  <Link scroll={false} href="/" className="nav-menu__link">
                    Home
                  </Link>
                </li>
                <li className="nav-menu__item">
                  <Link scroll={false} href="/all-product" className="nav-menu__link">
                    Products
                  </Link>
                </li>
                <li className="nav-menu__item">
                  <Link scroll={false} href="/how-it-works" className="nav-menu__link">
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
             
                <li className={`nav-menu__item ${pathname == "/contact" && "activePage"}`}>
                  <Link scroll={false} href="/contact" className="nav-menu__link">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            {/* Menu End  */}
            {/* Header Right start */}
            <div className="header-right flx-align">
              <Link scroll={false}
                href="/cart"
                className="header-right__button cart-btn position-relative"
              >
                <img
                  src="assets/images/icons/cart.svg"
                  alt=""
                  className="white-version"
                />
                <img
                  src="assets/images/icons/cart-white.svg"
                  alt=""
                  className="dark-version"
                />
                <span className="qty-badge font-12">0</span>
              </Link>
              {/* Light Dark Mode */}
              <ThemeToggle />
              {/* Light Dark Mode */}
              <div className="header-right__inner gap-3 flx-align d-lg-flex d-none">
                <Link scroll={false} href="/register" className="btn btn-main pill">
                  <span className="icon-left icon">
                    <img src="assets/images/icons/user.svg" alt="" />{" "}
                  </span>
                  Create Account
                </Link>
              </div>
              <button
                type="button"
                className="toggle-mobileMenu d-lg-none"
                onClick={mobileMenu}
              >
                <i className="las la-bars" />
              </button>
            </div>
            {/* Header Right End  */}
          </nav>
        </div>
      </header>
      {/* ==================== Header End Here ==================== */}

      <div className={`mobile-menu d-lg-none d-block ${active && "active"}`}>
        <button type="button" className="close-button text-body hover-text-main" onClick={mobileMenu}>
          <i className="las la-times" />
        </button>
        <div className="mobile-menu__inner">
          <Link scroll={false} href="/" className="mobile-menu__logo">
            <img
              src="assets/images/logo/logo.png"
              alt="Logo"
              className="white-version"
              style={{ filter: "invert(100%) hue-rotate(170deg)" }}
            />
            <img
              src="assets/images/logo/logo.png"
              alt="Logo"
              className="dark-version"
            />
          </Link>
          <div className="mobile-menu__menu">
            <ul
              className="nav-menu flx-align nav-menu--mobile"
              id="offcanvas-navigation"
            >
              <li className="nav-menu__item">
                <Link scroll={false} href="/" className="nav-menu__link">
                  Home
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link scroll={false} href="/all-product" className="nav-menu__link">
                  Products
                </Link>
              </li>
              <li className="nav-menu__item">
                <Link scroll={false} href="/how-it-works" className="nav-menu__link">
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
              <li className={`nav-menu__item ${pathname == "/contact" && "activePage"}`}>
                <Link scroll={false} href="/contact" className="nav-menu__link">
                  Contact
                </Link>
              </li>
            </ul>
            <div className="header-right__inner d-lg-none my-3 gap-1 d-flex flx-align">
              <Link scroll={false} href="/register" className="btn btn-main pill">
                <span className="icon-left icon">
                  <img src="assets/images/icons/user.svg" alt="" />{" "}
                </span>
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderOne;
