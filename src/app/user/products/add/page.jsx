"use client";

import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

import { useFetchCategories } from "@/queries/fetch-categories";
import { useAddProduct } from "@/queries/add-product";

import { IoMdInformationCircle } from "react-icons/io";

const page = () => {
  const initialState = {
    name: "",
    summary: "",
    price: "",
    currency: "USD",
    category: "",
    subscribers: "",
    engagementRate: "",
    language: "",
    postingFrequency: "",
    monetizationMethods: "",
    averageViews: "",
    images: [],
  };

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [step, setStep] = useState("IDLE");

  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");

  const [session, setSession] = useState("");
  const [tempSession, setTempSession] = useState("");
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [isVerified, setIsVerified] = useState(false);

  const {
    name,
    summary,
    price,
    currency,
    category,
    images,
    subscribers,
    engagementRate,
    language,
    postingFrequency,
    monetizationMethods,
    averageViews,
  } = formData;

  const { data: categories } = useFetchCategories();
  const { mutate, isPending, isSuccess, isError, data, error, reset } =
    useAddProduct();

  const getListingQuality = () => {
    let score = 0;

    if (name?.trim().length >= 10) score += 10;
    if (summary?.trim().length >= 80) score += 20;
    if (category) score += 5;
    if (language) score += 5;
    if (postingFrequency) score += 5;

    if (images?.length >= 1) score += 10;
    if (images?.length >= 3) score += 5;

    if (subscribers && Number(subscribers) > 0) score += 5;
    if (averageViews) score += 5;
    if (engagementRate) score += 10;

    if (isVerified) score += 20;

    return Math.min(score, 100);
  };

  const score = getListingQuality();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      fileType: "image/webp",
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.error("Compression error:", error);
      return file;
    }
  };

  const handleAddProduct = async () => {
    // if (!isVerified) {
    //   alert("Please verify Telegram channel first");
    //   return;
    // }

    const form = new FormData();

    form.append("name", name);
    form.append("summary", summary);
    form.append("price", price);
    form.append("category", category);
    form.append("currency", currency);
    form.append("subscribers", subscribers);
    form.append("engagementRate", engagementRate);
    form.append("language", language);
    form.append("postingFrequency", postingFrequency);
    form.append("monetizationMethods", monetizationMethods);
    form.append("averageViews", averageViews);

    const compressedImages = await Promise.all(
      images.map((file) => compressImage(file)),
    );

    compressedImages.forEach((file) => {
      form.append("images", file);
    });

    mutate(form);
  };

  const sendCode = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/telegram/send-code", {
        method: "POST",
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      setPhoneCodeHash(data.phoneCodeHash);
      setTempSession(data.session);
      setStep("OTP");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/verify-code", {
        method: "POST",
        body: JSON.stringify({
          phone,
          code,
          phoneCodeHash,
          session: tempSession,
        }),
      });

      const data = await res.json();

      setSession(data.session);
      setStep("CHANNELS");

      fetchChannels(data.session);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async (session) => {
    setLoading(true);
    try {
      const res = await fetch("/api/telegram/get-channels", {
        method: "POST",
        body: JSON.stringify({ session }),
      });

      const data = await res.json();

      setChannels(data.channels);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyChannel = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/telegram/verify-channels", {
        method: "POST",
        body: JSON.stringify({
          session,
          channelId: selectedChannel.id,
        }),
      });

      const data = await res.json();

      if (data.verified) {
        setIsVerified(true);
        setStep("DONE");

        // Autofill form
        setFormData((prev) => ({
          ...prev,
          name: data.channelName,
          subscribers: data.subscribers?.toString(),
          averageViews: data.averageViews?.toString(),
          engagementRate: data.engagementRate?.toString(),
        }));
      } else {
        alert("You are not admin of this channel");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isError || isSuccess) {
      const timer = setTimeout(() => {
        reset();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isError, isSuccess, reset]);

  return (
    <div className="dashboard-body__content">
      <div className="card common-card">
        <div className="card-header">
          <h6 className="title">Add Product</h6>
        </div>

        <div className="card-body">
          <div className="row gy-3">
            {/* Listing Quality */}
            <div className="col-12">
              <div className="p-3 rounded bg-white shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>Listing Quality</strong>
                  <span
                    className={`badge ${
                      score < 50
                        ? "bg-danger"
                        : score < 80
                          ? "bg-warning text-dark"
                          : "bg-success"
                    }`}
                  >
                    {score}%
                  </span>
                </div>

                <div className="progress mb-2" style={{ height: "6px" }}>
                  <div
                    className={`progress-bar ${
                      score < 50
                        ? "bg-danger"
                        : score < 80
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                {/* Suggestions */}
                <ul className="small mb-0 ps-3 text-muted">
                  {!images?.length && <li>📸 Add images (+10%)</li>}
                  {summary.length < 80 && (
                    <li>📝 Improve description (+20%)</li>
                  )}
                  {!engagementRate && <li>📊 Add engagement rate (+10%)</li>}
                  {!isVerified && <li>✔ Verify channel (+20%)</li>}
                </ul>

                {/* Status Message */}
                <div className="mt-2 small">
                  {score < 50 && (
                    <span className="text-danger">
                      Low quality listing — may not attract buyers
                    </span>
                  )}
                  {score >= 50 && score < 80 && (
                    <span className="text-warning">
                      Good — improve to rank higher
                    </span>
                  )}
                  {score >= 80 && (
                    <span className="text-success">
                      High quality — ready to perform well 🚀
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* VERIFICATION BUTTON */}
            <div className="col-12">
              <div className="p-3 rounded shadow border-start border-4 border-success bg-white">
                <p className="fw-semibold text-success mb-2">
                  🚀 Verify your channel to unlock:
                </p>

                <ul className="list-unstyled mb-0 small">
                  <li className="mb-2">✔ Increase buyer trust</li>
                  <li className="mb-2">✔ Rank higher in listings</li>
                  <li>
                    ✔ Get a <strong>“Verified”</strong> badge
                  </li>
                </ul>
              </div>
            </div>

            <div className="col-12">
              <button
                type="button"
                className="verify-button"
                onClick={() => setStep("PHONE")}
              >
                Verify Telegram Channel
              </button>
            </div>

            {step === "PHONE" && (
              <div className="col-12">
                <input
                  className="common-input"
                  type="tel"
                  placeholder="Enter phone (+91...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <button
                  disabled={loading}
                  className="btn btn-main btn-sm mt-3"
                  onClick={sendCode}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>
            )}

            {step === "OTP" && (
              <div className="col-12">
                <input
                  type="tel"
                  className="common-input"
                  placeholder="Enter OTP"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  disabled={loading}
                  className="btn btn-main btn-sm mt-3"
                  onClick={verifyCode}
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
              </div>
            )}

            {step === "CHANNELS" && (
              <div className="col-12">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h6 className="mb-3">Select Channel</h6>

                    <div
                      className="list-group"
                      style={{ maxHeight: "220px", overflowY: "auto" }}
                    >
                      {channels.map((ch) => (
                        <label
                          key={ch.id}
                          className={`list-group-item list-group-item-action d-flex align-items-center gap-2 ${
                            selectedChannel?.id === ch.id ? "active" : ""
                          }`}
                          style={{ cursor: "pointer" }}
                        >
                          <input
                            className="form-check-input me-2"
                            type="radio"
                            name="channel"
                            checked={selectedChannel?.id === ch.id}
                            onChange={() => setSelectedChannel(ch)}
                          />

                          <span>{ch.title}</span>
                        </label>
                      ))}
                    </div>

                    <button
                      className="btn btn-main btn-sm mt-3 w-100"
                      onClick={verifyChannel}
                      disabled={!selectedChannel || loading}
                    >
                      {loading ? "Verifying..." : "Verify Channel"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* NAME */}
            <div className="col-sm-6">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={name}
                disabled={isVerified}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* PRICE */}
            <div className="col-sm-6">
              <label className="form-label">Price</label>
              <input
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* CURRENCY */}
            <div className="col-sm-6">
              <label className="form-label">Currency</label>
              <input
                type="text"
                name="currency"
                disabled
                value={currency}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* CATEGORIES */}
            <div className="col-sm-6">
              <label className="form-label">Categories</label>
              <select
                name="category"
                value={category}
                className="common-input"
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category?.id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>

            {/* LANGUAGE */}
            <div className="col-sm-6">
              <label className="form-label">Main Language</label>
              <select
                name="language"
                id="language"
                className="common-input"
                value={language}
                onChange={handleChange}
              >
                <option value="">Select Language</option>

                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Arabic">Arabic</option>
                <option value="Portuguese">Portuguese</option>
                <option value="Russian">Russian</option>
                <option value="Indonesian">Indonesian</option>
                <option value="Turkish">Turkish</option>
                <option value="Bengali">Bengali</option>

                <option value="Multi-language">Multi-language</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* POSTING FREQUENCY */}
            <div className="col-sm-6">
              <label className="form-label">Posting Frequency</label>
              <select
                name="postingFrequency"
                id="postingFrequency"
                className="common-input"
                value={postingFrequency}
                onChange={handleChange}
              >
                <option value="">Select Frequency</option>

                <option value="Multiple times daily">
                  Multiple times daily
                </option>
                <option value="Daily">Daily</option>
                <option value="3–5 times per week">3–5 times per week</option>
                <option value="1–2 times per week">1–2 times per week</option>
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Irregular">Irregular</option>
              </select>
            </div>

            {/* SUBSCRIBERS */}
            <div className="col-sm-6">
              <label className="form-label">Subscribers Count</label>
              <input
                type="text"
                name="subscribers"
                value={subscribers}
                onChange={handleChange}
                disabled={isVerified}
                className="common-input"
              />
            </div>

            {/* ENGAGEMENT RATE */}
            <div className="col-sm-6">
              <label className="form-label d-flex align-items-center gap-1">
                Engagement Rate
                <button
                  type="button"
                  className="text-primary"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Engagement rate measures how actively your audience interacts with content (views, likes, comments). Higher engagement means a more active and valuable audience."
                >
                  <IoMdInformationCircle size={20} />
                </button>
              </label>

              <select
                className="common-input"
                name="engagementRate"
                value={engagementRate}
                onChange={handleChange}
              >
                <option value="">Select Engagement Rate</option>
                <option value="<5%">Less than 5%</option>
                <option value="5–10%">5–10%</option>
                <option value="10–20%">10–20%</option>
                <option value="20%+">20%+</option>
              </select>
            </div>

            {/* MONETIZATION METHODS */}
            <div className="col-sm-6">
              <label className="form-label">Monetization Methods</label>
              <select
                name="monetizationMethods"
                id="monetizationMethods"
                className="common-input"
                value={monetizationMethods}
                onChange={handleChange}
              >
                <option value="">Select Monetization Methods</option>
                <option value="Ad sales">Ad sales</option>
                <option value="Affiliate marketing">Affiliate marketing</option>
                <option value="Own products">Own products</option>
                <option value="Paid community">Paid community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* AVERAGE VIEWS */}
            <div className="col-sm-6">
              <label className="form-label">Average Views</label>
              <input
                type="text"
                name="averageViews"
                value={averageViews}
                onChange={handleChange}
                className="common-input"
              />
            </div>

            {/* UPLOAD IMAGES */}
            <div className="col-sm-12 mb-4">
              <label className="form-label fw-semibold">Upload Images</label>

              <div className="info-box mb-2">
                <p className="mb-1 small text-muted">
                  Upload up to <strong>3 images</strong> that represent your
                  channel:
                </p>
                <ul className="small mb-0 ps-3 text-muted">
                  <li>✔ Logo or profile picture</li>
                  <li>✔ Content screenshots</li>
                  <li>✔ Stats / analytics (optional)</li>
                </ul>
              </div>

              <input
                type="file"
                multiple
                accept="image/*"
                className="common-input"
                onChange={handleImageChange}
              />

              <small className="text-muted">
                High-quality images increase buyer trust
              </small>
            </div>

            {/* SUMMARY */}
            <div className="col-sm-12">
              <label className="form-label fw-semibold">Summary</label>

              <div className="info-box mb-2">
                <p className="mb-1 small text-muted">
                  Write a short description including:
                </p>
                <ul className="small mb-0 ps-3 text-muted">
                  <li>✔ Channel topic or niche</li>
                  <li>✔ Type of content posted</li>
                  <li>✔ Target audience</li>
                  <li>✔ Unique value (engagement, niche, etc.)</li>
                </ul>
              </div>

              <textarea
                name="summary"
                value={summary}
                onChange={handleChange}
                className="common-input"
                rows={4}
                placeholder="Example: A crypto news channel with 25k active subscribers. We post daily updates, market trends, and trading insights. Audience is mainly beginners and traders."
              />

              <small className="text-muted">
                A clear summary helps buyers understand your channel quickly
              </small>
            </div>

            {/* MESSAGES */}
            <div className="col-12">
              {isSuccess && data.message && (
                <p className="text-success mb-2">{data.message}</p>
              )}

              {isError && error && (
                <p className="text-danger mb-2">{error.message}</p>
              )}
            </div>

            {/* SUBMIT */}
            <div className="col-12">
              <button
                type="button"
                className="btn btn-main w-100"
                onClick={handleAddProduct}
                disabled={isPending}
              >
                {isPending ? "Creating..." : "Create Product"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
