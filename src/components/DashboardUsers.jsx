"use client";

import { useEffect, useMemo, useState } from "react";
import Preloader from "@/helper/Preloader";
import { useFetchAllUsers } from "@/queries/dashboard-users";
import { useSendContactMessage } from "@/queries/actions/contact";
import { useBanUser } from "@/queries/actions/ban-user";
import { useUnbanUser } from "@/queries/actions/unban-user";
import { useVerifyUser } from "@/queries/actions/verify-user";
import { useUnverifyUser } from "@/queries/actions/unverify-user";
import toast from "react-hot-toast";

const DashboardUsers = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  const [filters, setFilter] = useState({
    search: "",
    role: "",
  });

  const { subject, message } = contactForm;

  const usersPerPage = 10;

  const { data: users, isLoading } = useFetchAllUsers();
  const { mutate: sendContactMessage, isPending } = useSendContactMessage();
  const { mutate: banUser, isPending: isBanning } = useBanUser();
  const { mutate: unBanUser, isPending: isUnbanning } = useUnbanUser();
  const { mutate: verifyUser, isPending: isVerifying } = useVerifyUser();
  const { mutate: unVerifyUser, isPending: isUnverifying } = useUnverifyUser();

  const { search, role } = filters;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = (type, user) => {
    setSelectedUser(user);
    setTimeout(() => setActiveModal(type), 100);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendMessage = () => {
    sendContactMessage(
      {
        recipientName: selectedUser?.name,
        email: selectedUser?.email,
        ...contactForm,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          setTimeout(() => {
            closeModal();
          }, 2000);
        },
        onError: (data) => {
          toast.error(data.error || "Message cannot be sent");
        },
      },
    );
  };

  const isBanned = selectedUser?.isBanned;
  const isVerifiedUser = selectedUser?.isVerified;

  const handleUserStatus = () => {
    if (!selectedUser) return;

    if (isBanned) {
      unBanUser(
        {
          userId: selectedUser?.id,
          name: selectedUser?.name,
          email: selectedUser?.email,
        },
        {
          onSuccess: () => {
            toast.success("User access restored successfully.");
            setTimeout(() => {
              closeModal();
            }, 2000);
          },
          onError: () => toast.error("Failed to restore user."),
        },
      );
    } else {
      banUser(
        {
          userId: selectedUser?.id,
          name: selectedUser?.name,
          email: selectedUser?.email,
        },
        {
          onSuccess: () => {
            toast.success("User banned successfully.");
            setTimeout(() => {
              closeModal();
            }, 2000);
          },
          onError: () => toast.error("Failed to ban user."),
        },
      );
    }
  };

  const handleUserVerifyStatus = () => {
    if (!selectedUser) return;

    if (isVerifiedUser) {
      unVerifyUser(
        {
          userId: selectedUser?.id,
          name: selectedUser?.name,
          email: selectedUser?.email,
        },
        {
          onSuccess: () => {
            toast.success("User unverified and notification sent.");
            setTimeout(() => {
              closeModal();
            }, 2000);
          },
          onError: () => toast.error("Failed to unverify the user."),
        },
      );
    } else {
      verifyUser(
        {
          userId: selectedUser?.id,
          name: selectedUser?.name,
          email: selectedUser?.email,
        },
        {
          onSuccess: () => {
            toast.success("User verified and notification sent.");
            setTimeout(() => {
              closeModal();
            }, 2000);
          },
          onError: () => toast.error("Failed to verify the user."),
        },
      );
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getVisiblePages = () => {
    const pages = [];

    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);

    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];

    return users?.filter((user) => {
      const matchesSearch = user.name
        .toLowerCase()
        .includes(search.toLocaleLowerCase());
      const matchesRole = role
        ? user.role.toLowerCase() === role.toLocaleLowerCase()
        : true;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const totalTransactions = selectedUser?.orders?.length || 0;

  const totalVolume = selectedUser?.orders?.reduce((sum, order) => {
    return sum + (order.product?.price || 0);
  }, 0);

  useEffect(() => {
    const html = document.documentElement;

    setIsDarkMode(html.getAttribute("data-theme") === "dark");

    const observer = new MutationObserver(() => {
      const theme = html.getAttribute("data-theme");
      setIsDarkMode(theme === "dark");
    });

    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, role]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <div className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
          <h5 className="mb-0">All Users</h5>
          <div className="d-flex align-items-center gap-2">
            <input
              className="form-control"
              type="text"
              name="search"
              value={search}
              onChange={handleInputChange}
              placeholder="Search users..."
            />
            <select
              name="role"
              id="role"
              className="form-select"
              value={role}
              onChange={handleInputChange}
            >
              <option value="">All Roles</option>
              <option value="Buyer">Buyer</option>
              <option value="Seller">Seller</option>
            </select>
          </div>
        </div>
        <span className="text-muted small">Total Users: {users?.length}</span>

        <div className="table-responsive">
          <table
            className={`table table-hover align-middle ${
              isDarkMode ? "table-dark text-white" : "table-light text-dark"
            }`}
          >
            <thead className={isDarkMode ? "table-dark" : "table-light"}>
              <tr>
                <th>S No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody className={isDarkMode ? "text-white" : "text-dark"}>
              {currentUsers?.length > 0 ? (
                currentUsers.map((user, index) => {
                  return (
                    <tr key={user.id}>
                      <td>{indexOfFirstUser + index + 1}</td>
                      <td className="fw-medium">{user?.name}</td>

                      <td>{user?.email}</td>

                      <td className="text-uppercase">{user?.role}</td>

                      <td className="text-uppercase">
                        {user?.isVerified ? "true" : "false"}
                      </td>
                      <td className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          type="button"
                          className={`btn btn-sm ${
                            user?.isBanned ? "btn-success" : "btn-danger"
                          }`}
                          onClick={() => handleOpenModal("ban", user)}
                        >
                          {user?.isBanned ? "Unban" : "Ban"}
                        </button>

                        <button
                          type="button"
                          className={`btn btn-sm ${
                            user?.isVerified ? "btn-secondary" : "btn-primary"
                          }`}
                          onClick={() => handleOpenModal("verify", user)}
                        >
                          {user?.isVerified ? "Unverify" : "Verify"}
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-info"
                          onClick={() => handleOpenModal("contact", user)}
                        >
                          Contact
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          onClick={() => handleOpenModal("view", user)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No Users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination-container">
            {/* Prev */}
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              ←
            </button>

            {/* First + dots */}
            {getVisiblePages()[0] > 1 && (
              <>
                <button className="page-btn" onClick={() => setCurrentPage(1)}>
                  1
                </button>
                {getVisiblePages()[0] > 2 && <span className="dots">...</span>}
              </>
            )}

            {/* Middle Pages */}
            {getVisiblePages().map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {/* Last + dots */}
            {getVisiblePages().slice(-1)[0] < totalPages && (
              <>
                {getVisiblePages().slice(-1)[0] < totalPages - 1 && (
                  <span className="dots">...</span>
                )}
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(totalPages)}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next */}
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* BAN MODAL */}
      {activeModal === "ban" && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "ban" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${activeModal === "ban" ? "show d-block" : "d-block"}`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    {selectedUser?.isBanned
                      ? "Restore user account access?"
                      : "Ban this user account?"}
                  </h5>

                  <button
                    className="btn-close"
                    onClick={closeModal}
                    disabled={isBanning || isUnbanning}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="mb-2">
                    You are about to{" "}
                    <strong>
                      {selectedUser?.isBanned ? "restore access for" : "ban"}
                    </strong>{" "}
                    <strong>{selectedUser?.name}</strong>
                    {selectedUser?.email ? ` (${selectedUser.email})` : ""}.
                  </p>

                  <p className="mb-2 text-muted small">
                    {selectedUser?.isBanned
                      ? "The user will regain full access to the platform, including listings, purchases, and account features."
                      : "The user will lose access to the platform, listings, purchases, and account features until the restriction is removed."}
                  </p>

                  {!selectedUser?.isBanned && (
                    <p className="mb-0 text-danger small fw-semibold">
                      This action may impact the user’s ongoing transactions and
                      visibility on the platform.
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={isBanning || isUnbanning}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      selectedUser?.isBanned ? "btn-success" : "btn-danger"
                    }`}
                    onClick={handleUserStatus}
                    disabled={isBanning || isUnbanning}
                  >
                    {selectedUser?.isBanned
                      ? isUnbanning
                        ? "Restoring..."
                        : "Restore Access"
                      : isBanning
                        ? "Banning..."
                        : "Ban User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeModal === "verify" && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "verify" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${activeModal === "verify" ? "show d-block" : "d-block"}`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    {selectedUser?.isVerified
                      ? "Remove user verification?"
                      : "Verify this user account?"}
                  </h5>

                  <button
                    className="btn-close"
                    onClick={closeModal}
                    disabled={isVerifying || isUnverifying}
                  ></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <p className="mb-2">
                    You are about to{" "}
                    <strong>
                      {selectedUser?.isVerified
                        ? "remove verification from"
                        : "verify"}
                    </strong>{" "}
                    <strong>{selectedUser?.name}</strong>
                    {selectedUser?.email ? ` (${selectedUser.email})` : ""}.
                  </p>

                  <p className="mb-2 text-muted small">
                    {selectedUser?.isVerified
                      ? "The user will lose their verified status and any associated trust indicators on the platform."
                      : "The user will gain verified status, increasing their credibility and visibility on the platform."}
                  </p>

                  {selectedUser?.isVerified && (
                    <p className="mb-0 text-warning small fw-semibold">
                      Removing verification may reduce user trust and impact
                      their engagement or transactions.
                    </p>
                  )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={closeModal}
                    disabled={isVerifying || isUnverifying}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className={`btn ${
                      selectedUser?.isVerified ? "btn-success" : "btn-info"
                    }`}
                    onClick={handleUserVerifyStatus}
                    disabled={isVerifying || isUnverifying}
                  >
                    {selectedUser?.isVerified
                      ? isUnverifying
                        ? "Removing..."
                        : "Remove Verification"
                      : isVerifying
                        ? "Verifying..."
                        : "Verify User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* EMAIL / CONTACT MODAl */}
      {activeModal === "contact" && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "contact" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              activeModal === "contact" ? "show d-block" : "d-block"
            }`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    Quick Email / Contact Option
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <div className="mb-3">
                    <label
                      htmlFor="recipientName"
                      className="form-label fw-semibold"
                    >
                      Recipient Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="recipientName"
                      value={selectedUser?.name}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={selectedUser?.email}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-semibold">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={subject}
                      onChange={handleContactFormChange}
                      className="form-control"
                      placeholder="Enter subject"
                    />
                  </div>

                  <div className="mb-0">
                    <label htmlFor="message" className="form-label fw-semibold">
                      Message
                    </label>
                    <textarea
                      name="message"
                      rows="5"
                      value={message}
                      onChange={handleContactFormChange}
                      className="form-control"
                      placeholder="Write your message..."
                    ></textarea>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>

                  <button
                    disabled={isPending}
                    onClick={handleSendMessage}
                    type="button"
                    className="btn btn-primary"
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* METRICS MODAL */}
      {activeModal === "view" && selectedUser && (
        <>
          {/* Backdrop */}
          <div
            className={`modal-backdrop fade ${activeModal === "view" ? "show" : ""}`}
            onClick={closeModal}
          ></div>

          {/* Modal */}
          <div
            className={`modal fade ${
              activeModal === "view" ? "show d-block" : "d-block"
            }`}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="modal-header">
                  <h5 className="modal-title fw-semibold">
                    Additional Details
                  </h5>
                  <button className="btn-close" onClick={closeModal}></button>
                </div>

                {/* Body */}
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>Joined:</strong>{" "}
                      {formatDate(selectedUser?.createdAt)}
                    </div>
                  </div>

                  <hr />

                  <h6 className="fw-semibold mb-3">Performance Metrics</h6>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <small className="text-muted d-block">
                          Total Transactions
                        </small>
                        <h4>
                          {totalTransactions > 9
                            ? totalTransactions
                            : `0${totalTransactions}`}
                        </h4>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="border rounded p-3">
                        <small className="text-muted d-block">
                          Total Volume ($)
                        </small>
                        <h4>${totalVolume}</h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DashboardUsers;
