"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

/* ============================
   GraphQL Mutations
============================ */

const REGISTER_EMAIL_SEND = gql`
  mutation RegisterEmailSend($email: String!) {
    registerEmailSend(email: $email) {
      timeout
      length
    }
  }
`;

const REGISTER_EMAIL_VERIFY = gql`
  mutation RegisterEmailVerify($email: String!, $otp: String!) {
    registerEmailVerify(email: $email, otp: $otp)
  }
`;

const REGISTER = gql`
  mutation Register(
    $username: String!
    $email: String!
    $password: String!
    $name: String
  ) {
    register(
      username: $username
      email: $email
      password: $password
      name: $name
    ) {
      token
      user {
        id
        username
        email
        name
      }
    }
  }
`;

/* ============================
   Component
============================ */

const Register = () => {
  const [step, setStep] = useState("FORM"); // FORM | OTP | DONE
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    otp: "",
  });

  const { name, username, email, password, otp } = formData;

  const [sendOtp, { loading: sendingOtp }] =
    useMutation(REGISTER_EMAIL_SEND);

  const [verifyOtp, { loading: verifyingOtp }] =
    useMutation(REGISTER_EMAIL_VERIFY);

  const [registerUser, { loading: registering }] =
    useMutation(REGISTER);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ============================
     Step 1 — Send OTP
  ============================ */
  const handleSendOtp = async () => {
    setError(null);
    try {
      await sendOtp({ variables: { email } });
      setStep("OTP");
    } catch (err) {
      setError(err.message);
    }
  };

  /* ============================
     Step 2 — Verify OTP + Register
  ============================ */
  const handleVerifyAndRegister = async () => {
    setError(null);
    try {
      const { data } = await verifyOtp({
        variables: { email, otp },
      });

      if (!data.registerEmailVerify) {
        throw new Error("Invalid OTP");
      }

      const result = await registerUser({
        variables: {
          username,
          email,
          password,
          name,
        },
      });

      localStorage.setItem("token", result.data.register.token);
      setStep("DONE");
    } catch (err) {
      if (err.message.includes("Verification expired")) {
        setStep("FORM");
      }
      setError(err.message);
    }
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
                  className="btn btn-main w-100"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending OTP..." : "Continue"}
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
                  className="btn btn-main w-100"
                  onClick={handleVerifyAndRegister}
                  disabled={verifyingOtp || registering}
                >
                  {registering ? "Creating Account..." : "Verify & Create"}
                </button>

                <button
                  className="btn btn-outline w-100"
                  onClick={handleSendOtp}
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
