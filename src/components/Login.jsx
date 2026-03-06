"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

import { useLoginUser } from "@/queries/login";
import { signIn } from "next-auth/react";

const Login = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;

  const { mutate, data, error, isSuccess, isError } = useLoginUser();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserLogin = async () => {
    mutate(formData);
    
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error(result.error);
        return;
      }

      router.push("/user/dashboard");
    } catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    router.prefetch("/user/dashboard");
  }, []);

  return (
    <>
      {/* ================================== Account Page Start =========================== */}
      <section className="account d-flex">
        <div className="account__left d-md-flex d-none flx-align section-bg position-relative z-index-1 overflow-hidden">
          <img
            src="assets/images/shapes/pattern-curve-seven.png"
            alt=""
            className="position-absolute end-0 top-0 z-index--1 h-100"
          />
        </div>

        <div className="account__right padding-y-120 flx-align">
          <div className="dark-light-mode">
            <ThemeToggle />
          </div>

          <div className="account-content">
            <Link scroll={false} href="/" className="logo mb-64">
              <img
                src="assets/images/logo/logo.png"
                alt=""
                className="white-version"
                style={{ filter: "invert(100%) hue-rotate(170deg)" }}
              />
              <img
                src="assets/images/logo/logo.png"
                alt=""
                className="dark-version"
              />
            </Link>

            <h4 className="account-content__title mb-48 text-capitalize">
              Welcome Back!
            </h4>

            <form>
              <div className="row gy-4">
                {/* ================= EMAIL ================= */}
                <div className="col-12">
                  <label
                    htmlFor="email"
                    className="form-label mb-2 font-18 font-heading fw-600"
                  >
                    Email
                  </label>
                  <div className="position-relative">
                    <input
                      type="email"
                      className="common-input common-input--bg common-input--withIcon"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleInputChange}
                      required
                      placeholder="infoname@mail.com"
                    />
                    <span className="input-icon">
                      <img src="assets/images/icons/envelope-icon.svg" alt="" />
                    </span>
                  </div>
                </div>

                {/* ================= PASSWORD ================= */}
                <div className="col-12">
                  <label
                    htmlFor="password"
                    className="form-label mb-2 font-18 font-heading fw-600"
                  >
                    Password
                  </label>
                  <div className="position-relative">
                    <input
                      type="password"
                      className="common-input common-input--bg common-input--withIcon"
                      id="password"
                      name="password"
                      value={password}
                      onChange={handleInputChange}
                      required
                      placeholder="6+ characters, 1 Capital letter"
                    />
                    <span className="input-icon">
                      <img src="assets/images/icons/lock-icon.svg" alt="" />
                    </span>
                  </div>
                </div>

                {/* ================= ERROR ================= */}
                {isError && error && (
                  <div className="col-12">
                    <p className="text-danger font-14">{error.message}</p>
                  </div>
                )}

                {isSuccess && data?.message && (
                  <div className="col-12">
                    <p className="text-success font-14">{data?.message}</p>
                  </div>
                )}

                {/* ================= REMEMBER / FORGOT ================= */}
                <div className="col-12">
                  <div className="flx-between gap-1">
                    <div className="common-check my-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="keepMe"
                      />
                      <label
                        className="form-check-label mb-0 fw-400 font-14 text-body"
                        htmlFor="keepMe"
                      >
                        Remember Me
                      </label>
                    </div>
                  </div>
                </div>

                {/* ================= SUBMIT ================= */}
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-main btn-lg w-100 pill"
                    onClick={handleUserLogin}
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </button>
                </div>

                {/* ================= REGISTER ================= */}
                <div className="col-sm-12 mb-0">
                  <div className="have-account">
                    <p className="text font-14">
                      New to Dealtous?{" "}
                      <Link
                        scroll={false}
                        className="link text-main text-decoration-underline fw-500"
                        href="/register"
                      >
                        Sign up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* ================================== Account Page End =========================== */}
    </>
  );
};

export default Login;
