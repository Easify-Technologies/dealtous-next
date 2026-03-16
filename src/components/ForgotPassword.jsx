"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useVerifyUserEmail } from "@/queries/update-password";
import { useUpdateUserPassword } from "@/queries/update-password";

import ThemeToggle from "./ThemeToggle";

const ForgotPassword = () => {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const {
    mutate: verifyEmail,
    isPending: verifyPending,
    isError: verifyIsError,
    isSuccess: verifyIsSuccess,
    data: verifyData,
    error: verifyError,
  } = useVerifyUserEmail();

  const {
    mutate: updatePassword,
    isPending: updatePending,
    isError: updateIsError,
    isSuccess: updateIsSuccess,
    data: updateData,
    error: updateError,
  } = useUpdateUserPassword();

  const { email, password, confirmPassword } = formDetails;

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleVerify = (email) => {
    if (!email) return;

    verifyEmail(
      { email },
      {
        onSuccess: () => {
          setTimeout(() => {
            setStep(2);
          }, 1500);
        },
      },
    );
  };

  const handleUpdatePassword = (data) => {
    updatePassword(data, {
      onSuccess: () => {
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      },
    });
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
              Update Your Password
            </h4>

            {step === 1 && (
              <form>
                <div className="row gy-4">
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
                        placeholder="info@gmail.com"
                      />
                      <span className="input-icon">
                        <img src="assets/images/icons/lock-icon.svg" alt="" />
                      </span>
                    </div>
                  </div>

                  {verifyIsError && verifyError && (
                    <div className="col-12">
                      <p className="text-danger font-14">
                        {verifyError.message}
                      </p>
                    </div>
                  )}

                  {verifyIsSuccess && verifyData?.message && (
                    <div className="col-12">
                      <p className="text-success font-14">
                        {verifyData?.message}
                      </p>
                    </div>
                  )}

                  <div className="col-12">
                    <button
                      type="button"
                      disabled={verifyPending}
                      onClick={() => handleVerify(email)}
                      className="btn btn-main btn-lg w-100 pill"
                    >
                      {verifyPending ? "Verifying..." : "Verify Email"}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 2 && (
              <form>
                <div className="row gy-4">
                  {/* ================= PASSWORD ================= */}
                  <div className="col-12">
                    <label
                      htmlFor="password"
                      className="form-label mb-2 font-18 font-heading fw-600"
                    >
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="common-input common-input--bg common-input--withIcon"
                        id="password"
                        name="password"
                        value={password}
                        onChange={handleInputChange}
                        required
                        placeholder="6+ characters, 1 Capital letter"
                      />
                      <button type="button" className="input-icon" onClick={handleShowPassword}>
                        <img src={showPassword ? "assets/images/icons/lock-two.svg" : "assets/images/icons/lock-icon.svg"} alt="password-icon" />
                      </button>
                    </div>
                  </div>

                  {/* ================= PASSWORD ================= */}
                  <div className="col-12">
                    <label
                      htmlFor="password"
                      className="form-label mb-2 font-18 font-heading fw-600"
                    >
                      Confirm Your Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="common-input common-input--bg common-input--withIcon"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={handleInputChange}
                        placeholder="6+ characters, 1 Capital letter"
                      />
                      <button type="button" className="input-icon" onClick={handleShowConfirmPassword}>
                        <img src={showConfirmPassword ? "assets/images/icons/lock-two.svg" : "assets/images/icons/lock-icon.svg"} alt="password-icon" />
                      </button>
                    </div>
                  </div>

                  {updateIsError && updateError && (
                    <div className="col-12">
                      <p className="text-danger font-14">
                        {updateError.message}
                      </p>
                    </div>
                  )}

                  {updateIsSuccess && updateData?.message && (
                    <div className="col-12">
                      <p className="text-success font-14">
                        {updateData?.message}
                      </p>
                    </div>
                  )}

                  {/* ================= SUBMIT ================= */}
                  <div className="col-12">
                    <button
                      type="button"
                      disabled={updatePending}
                      onClick={() => handleUpdatePassword(formDetails)}
                      className="btn btn-main btn-lg w-100 pill"
                    >
                      {updatePending ? "Updating..." : "Update Your Password"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
