"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { useStartOnboardingProcess } from "@/queries/start-onboarding";
import { useFetchOnboardingDetails } from "@/queries/start-onboarding";
import { useUpdateUserInformation } from "@/queries/update-information";
import Preloader from "@/helper/Preloader";

const Settings = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    avatar: null,
    about: "",
  });

  const { name, username, country, city, address, zipCode, avatar, about } =
    formData;

  const {
    mutate: updateUserInformation,
    isPending,
    isSuccess,
    isError,
    data,
    error,
    reset,
  } = useUpdateUserInformation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      avatar: file,
    }));
  };

  const handleUpdateInformation = useCallback(() => {
    updateUserInformation(formData, {
      onSuccess: () => {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      },
    });
  }, [formData]);

  const params = useSearchParams();
  const onboarding = params.get("onboarding") ?? "";

  const userEmail = session?.user?.email ?? "";
  const userName = session?.user?.name ?? "";
  const role = session?.user?.role ?? "";

  const isSeller = role === "Seller";

  /* ------------------------------
   FETCH ONBOARDING DETAILS
--------------------------------*/
  const {
    data: onboardDetails,
    isPending: onBoardPending,
    refetch,
  } = useFetchOnboardingDetails(userEmail, {
    enabled: isSeller && !!userEmail,
  });

  /* ------------------------------
   START ONBOARDING MUTATION
--------------------------------*/
  const { mutateAsync: startOnboarding, isPending: startPending } =
    useStartOnboardingProcess();

  const isOnboarded =
    onboardDetails?.account?.charges_enabled &&
    onboardDetails?.account?.payouts_enabled;

  /* ------------------------------
   START ONBOARDING HANDLER
--------------------------------*/
  const handleStartOnboarding = async () => {
    try {
      const res = await startOnboarding({
        name: userName,
        email: userEmail,
      });

      // refresh onboarding data
      await refetch();

      // redirect to Stripe onboarding
      if (res?.url) {
        router.push(res.url);
      }
    } catch (err) {
      console.error("Onboarding error:", err);
    }
  };

  /* ------------------------------
   REFRESH WHEN RETURNING
   FROM STRIPE
--------------------------------*/
  useEffect(() => {
    if (onboarding === "complete") {
      refetch();
    }
  }, [onboarding, refetch]);

  useEffect(() => {
    if (isError || isSuccess) {
      const timer = () => {
        setTimeout(() => {
          reset();
        }, 3000);
      };

      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, reset]);

  if (onBoardPending) return <Preloader />;

  return (
    <>
      <div className="dashboard-body__content">
        <div className="card common-card">
          <div className="card-body">
            {/* ================== Setting Section Start ====================== */}
            <div className="row gy-4">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div
                  className="setting-content"
                  data-bs-spy="scroll"
                  data-bs-target="#sidebar-scroll-spy"
                >
                  {isSeller && (
                    <>
                      <div className="card common-card shadow mb-24 p-4">
                        <h5 className="mb-3">🚀 Get Started Selling</h5>
                        <p className="text-muted mb-4">
                          Follow these quick steps to start earning from your
                          Telegram channel.
                        </p>

                        <div className="d-flex flex-column gap-3">
                          {/* Step 1 */}
                          <div className="d-flex align-items-start gap-3">
                            <div className="step-circle">1</div>
                            <div>
                              <p className="mb-1 fw-500">Connect Stripe</p>
                              <small className="text-muted">
                                Securely connect your Stripe account to receive
                                payments from buyers.
                              </small>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="d-flex align-items-start gap-3">
                            <div className="step-circle">2</div>
                            <div>
                              <p className="mb-1 fw-500">
                                Add your first channel
                              </p>
                              <small className="text-muted">
                                List your Telegram channel with details like
                                price, audience, and engagement.
                              </small>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="d-flex align-items-start gap-3">
                            <div className="step-circle">3</div>
                            <div>
                              <p className="mb-1 fw-500">Get verified</p>
                              <small className="text-muted">
                                Verification increases buyer trust and improves
                                your chances of selling faster.
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="card common-card border border-gray-five overflow-hidden mb-24"
                        id="startOnboarding"
                      >
                        <div className="card-header">
                          <h6 className="title">Onboarding Process</h6>
                        </div>
                        <div className="card-body">
                          <div className="row gy-3">
                            <div className="col-sm-12 col-xs-12">
                              <p>
                                To start selling on our platform, complete the
                                onboarding process by connecting your Stripe
                                account. This allows you to securely receive
                                payments and enable payouts for your sales.
                              </p>
                            </div>
                            {isSeller && onboardDetails && (
                              <div className="w-full pt-2">
                                <div className="row">
                                  <div className="col-lg-12">
                                    <div className="card shadow-lg border-0 rounded-4">
                                      <div className="card-header bg-primary text-white text-center rounded-top-4">
                                        <h4 className="mb-0 text-white">
                                          Seller Dashboard
                                        </h4>
                                      </div>

                                      <div className="card-body p-4">
                                        <div className="mb-3">
                                          <span className="fw-bold text-muted">
                                            Name
                                          </span>
                                          <p className="mb-0 fs-5">
                                            {onboardDetails?.seller?.name}
                                          </p>
                                        </div>

                                        <div className="mb-3">
                                          <span className="fw-bold text-muted">
                                            Email
                                          </span>
                                          <p className="mb-0 fs-5">
                                            {onboardDetails?.seller?.email}
                                          </p>
                                        </div>

                                        <div className="mb-3">
                                          <span className="fw-bold text-muted">
                                            Stripe Account ID
                                          </span>
                                          <p className="mb-0 fs-6 text-break">
                                            {onboardDetails?.account?.id}
                                          </p>
                                        </div>

                                        <hr />

                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                          <span className="fw-bold">
                                            Charges Enabled
                                          </span>

                                          <span
                                            className={`badge ${
                                              onboardDetails?.account
                                                ?.charges_enabled
                                                ? "bg-success"
                                                : "bg-danger"
                                            }`}
                                          >
                                            {onboardDetails?.account
                                              ?.charges_enabled
                                              ? "Enabled"
                                              : "Disabled"}
                                          </span>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                          <span className="fw-bold">
                                            Payouts Enabled
                                          </span>

                                          <span
                                            className={`badge ${
                                              onboardDetails?.account
                                                ?.payouts_enabled
                                                ? "bg-success"
                                                : "bg-danger"
                                            }`}
                                          >
                                            {onboardDetails?.account
                                              ?.payouts_enabled
                                              ? "Enabled"
                                              : "Disabled"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {!isOnboarded && (
                              <button
                                disabled={startPending}
                                type="button"
                                className="btn btn-main btn-sm"
                                onClick={handleStartOnboarding}
                              >
                                {startPending
                                  ? "Starting..."
                                  : "Start Onboarding"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div
                    className="card common-card border border-gray-five overflow-hidden mb-24"
                    id="personalInfo"
                  >
                    <div className="card-header">
                      <h6 className="title">Personal Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row gy-3">
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="country" className="form-label">
                            Country
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="country"
                            name="country"
                            value={country}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="address" className="form-label">
                            Address
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="address"
                            name="address"
                            value={address}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="city" className="form-label">
                            City
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="city"
                            name="city"
                            value={city}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="col-sm-6 col-xs-6">
                          <label htmlFor="zipCode" className="form-label">
                            Zip Code
                          </label>
                          <input
                            type="text"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="zipCode"
                            name="zipCode"
                            value={zipCode}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="card common-card border border-gray-five overflow-hidden mb-24"
                    id="profile"
                  >
                    <div className="card-header">
                      <h6 className="title">Additional Information</h6>
                    </div>
                    <div className="card-body">
                      <div className="row gy-3">
                        <div className="col-sm-12 col-xs-12">
                          <label htmlFor="avatar" className="form-label">
                            Upload a New Avatar
                          </label>
                          <input
                            type="file"
                            className="common-input common-input--md border--color-dark bg--white"
                            id="avatar"
                            name="avatar"
                            onChange={handleImageChange}
                          />
                        </div>
                        <div className="col-sm-12">
                          <label htmlFor="about" className="form-label">
                            Write Something About Your Profile
                          </label>
                          <textarea
                            className="common-input common-input--md border--color-dark bg--white"
                            id="about"
                            name="about"
                            value={about}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isSuccess && data.message && (
                    <p className="text-success mb-2">{data.message}</p>
                  )}

                  {isError && error && (
                    <p className="text-danger mb-2">{error.message}</p>
                  )}

                  <button
                    onClick={handleUpdateInformation}
                    disabled={isPending}
                    type="button"
                    className="btn w-100 btn-main btn-md"
                  >
                    {isPending ? "Saving..." : "Save Information"}
                  </button>
                </div>
                {/* </form> */}
              </div>
            </div>
            {/* ================== Setting Section End ====================== */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
