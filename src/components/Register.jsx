"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const Register = () => {
  const [step, setStep] = useState("FORM");
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const { name, username, email, password, otp } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <section className="account d-flex">
        <div className="account__left d-md-flex d-none flx-align section-bg position-relative z-index-1 overflow-hidden">
          <img
            src="assets/images/shapes/pattern-curve-seven.png"
            alt=""
            className="position-absolute end-0 top-0 z-index--1 h-100"
          />
        </div>

        <div className="account__right padding-t-120 flx-align">
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

            <h4 className="account-content__title mb-48">
              Create an Account
            </h4>

            {/* ================= FORM STEP ================= */}
            {step === "FORM" && (
              <div className="row gy-4">
                <input
                  className="common-input"
                  name="username"
                  placeholder="Username"
                  value={username}
                  onChange={handleInputChange}
                />

                <input
                  className="common-input"
                  name="name"
                  placeholder="Full Name"
                  value={name}
                  onChange={handleInputChange}
                />

                <input
                  className="common-input"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange}
                />

                <input
                  type="password"
                  className="common-input"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleInputChange}
                />

                <button
                  type="button"
                  className="btn btn-main w-100"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ================= OTP STEP ================= */}
            {step === "OTP" && (
              <div className="row gy-4">
                <input
                  className="common-input"
                  name="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={handleInputChange}
                />

                <button
                  type="button"
                  className="btn btn-main w-100"
                >
                  {"Verify & Create"}
                </button>

                <button
                  className="btn btn-outline w-100"
                >
                  Resend OTP
                </button>
              </div>
            )}

            {/* ================= DONE ================= */}
            {step === "DONE" && (
              <p className="text-success text-center">
                Account created successfully 🎉
              </p>
            )}

            {error && (
              <p className="text-danger mt-3 text-center">
                {error}
              </p>
            )}

            <p className="text-center mt-4">
              Already a member?{" "}
              <Link href="/login" className="text-main fw-500">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
