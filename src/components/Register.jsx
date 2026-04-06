"use client";

import { useState, useEffect } from "react";
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

  const isRegisterFormValid =
    name.trim() !== "" &&
    username.trim() !== "" &&
    role !== "" &&
    email.trim() !== "" &&
    password.trim() !== "";

  const isOtpFormValid = otp.trim() !== "";

  // ================= REGISTER MUTATION =================
  const {
    mutateAsync: registerUser,
    isPending,
    isError,
    isSuccess,
    error,
    data,
    reset,
  } = useUserRegister();

  // ================= OTP MUTATION =================
  const {
    mutateAsync: verifyOtp,
    isPending: verifyPending,
    isError: verifyError,
    error: verifyErrorData,
    isSuccess: verifySuccess,
    reset: resetOtp,
  } = useUserVerifyOtp();

  // ================= HANDLERS =================
  const handlePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterForm = async () => {
    if(!isRegisterFormValid) return;

    try {
      const res = await registerUser({
        name,
        username,
        email,
        password,
        role,
      });

      setUserId(res.userId);
      setStep("OTP");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleVerifyOtp = async () => {
    if(!isOtpFormValid) return;

    try {
      await verifyOtp({ code: otp, userId });
      setStep("DONE");
    } catch (err) {
      console.error(err.message);
    }
  };

  // ================= AUTO CLEAR MESSAGES =================
  useEffect(() => {
    if (isError || isSuccess) {
      const timer = setTimeout(() => {
        reset();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, reset]);

  useEffect(() => {
    if (verifyError || verifySuccess) {
      const timer = setTimeout(() => {
        resetOtp();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verifyError, verifySuccess, resetOtp]);

  return (
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
          <Link href="/" className="logo mb-64">
            <img
              src="assets/images/logo/logo.png"
              alt=""
              className="white-version"
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
                  style={{ width: "100%", border: 0, outline: 0 }}
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

              {/* ✅ ERROR MESSAGE */}
              {isError && error && (
                <p className="text-danger">{error.message}</p>
              )}

              {/* ✅ SUCCESS MESSAGE */}
              {isSuccess && data?.message && (
                <p className="text-success">{data.message}</p>
              )}

              <button
                onClick={handleRegisterForm}
                disabled={isPending || !isRegisterFormValid}
                type="button"
                className="btn btn-main w-100"
              >
                {isPending && isRegisterFormValid ? "Creating..." : "Continue"}
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

              {/* ✅ OTP ERROR */}
              {verifyError && (
                <p className="text-danger">{verifyErrorData?.message}</p>
              )}

              {/* ✅ OTP SUCCESS */}
              {verifySuccess && (
                <p className="text-success">OTP Verified Successfully</p>
              )}

              <button
                type="button"
                disabled={verifyPending || !isOtpFormValid}
                onClick={handleVerifyOtp}
                className="btn btn-main w-100"
              >
                {verifyPending && isOtpFormValid ? "Verifying..." : "Verify & Create"}
              </button>
            </div>
          )}

          {/* ================= DONE ================= */}
          {step === "DONE" && (
            <p className="text-success text-center">
              Account created successfully 🎉
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
  );
};

export default Register;
