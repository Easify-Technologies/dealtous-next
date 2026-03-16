"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

import { useUserRegister } from "../queries/register";
import { useUserVerifyOtp } from "../queries/verify-otp";

const Register = () => {
  const [step, setStep] = useState("FORM");
  const [userId, setUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
    otp: "",
  });

  const { name, username, email, password, role, otp } = formData;
  const { mutate, isPending, isSuccess, isError, data, error } =
    useUserRegister();
  const { mutate: verifyOtp, isPending: verifyPending } = useUserVerifyOtp();

  const handlePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterForm = () => {
    mutate(
      { name, username, email, password, role },
      {
        onSuccess: (data) => {
          setUserId(data.userId);
          setStep("OTP");
        },
      },
    );
  };

  const handleVerifyOtp = () => {
    verifyOtp(
      { code: otp, userId },
      {
        onSuccess: () => {
          setStep("DONE");
        },
      },
    );
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

            <h4 className="account-content__title mb-48">Create an Account</h4>

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

                <div className="common-input d-flex align-items-center justify-content-between">
                  <input
                    style={{ width: "100%", outline: 0, border: 0 }}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={handleInputChange}
                  />

                  <button type="button" onClick={handlePassword}>
                    <Image
                      src={
                        showPassword
                          ? "/assets/images/icons/lock-two.svg"
                          : "/assets/images/icons/lock-icon.svg"
                      }
                      alt="password-icon"
                      width={17}
                      height={17}
                      className="ms-2"
                    />
                  </button>
                </div>

                <select
                  className="common-input"
                  name="role"
                  value={role}
                  onChange={handleInputChange}
                >
                  <option value="">Select Role</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                </select>

                <button
                  onClick={handleRegisterForm}
                  disabled={isPending}
                  type="button"
                  className="btn btn-main w-100"
                >
                  {isPending ? "Creating..." : "Continue"}
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
                  disabled={verifyPending}
                  onClick={handleVerifyOtp}
                  className="btn btn-main w-100"
                >
                  {verifyPending ? "Verifying..." : "Verify & Create"}
                </button>

                <button className="btn btn-outline w-100">Resend OTP</button>
              </div>
            )}

            {/* ================= DONE ================= */}
            {step === "DONE" && (
              <p className="text-success text-center">
                Account created successfully 🎉
              </p>
            )}

            {error && (
              <p className="text-danger mt-3 text-center">{error.message}</p>
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
