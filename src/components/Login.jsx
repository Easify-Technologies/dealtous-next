"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const LOGIN_MUTATION = gql`
  mutation Login($identity: String!, $password: String!) {
    login(identity: $identity, password: $password) {
      id
      token
      user {
        id
        username
        email
        name
        image
      }
    }
  }
`;

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const { email, password } = formData;

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const session = data?.login;

      if (!session?.token) {
        setErrorMessage("Invalid login response");
        return;
      }

      // 🔐 Store token (temporary approach)
      localStorage.setItem("auth_token", session.token);
      localStorage.setItem("user", JSON.stringify(session.user));

      // Redirect after login
      router.push("/");
    },
    onError: (error) => {
      setErrorMessage(error.message || "Login failed");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    login({
      variables: {
        identity :email,
        password,
      },
    });
  };

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

            <form onSubmit={handleSubmit}>
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
                {errorMessage && (
                  <div className="col-12">
                    <p className="text-danger font-14">{errorMessage}</p>
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
                    <Link
                      scroll={false}
                      href="/forgot-password"
                      className="forgot-password text-decoration-underline text-main text-poppins font-14"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                {/* ================= SUBMIT ================= */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-main btn-lg w-100 pill"
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
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
