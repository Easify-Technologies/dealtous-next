"use client";

import { useEffect, useMemo, useState } from "react";
import Preloader from "@/helper/Preloader";
import { useFetchAllUsers } from "@/queries/dashboard-users";
import { FaEye } from "react-icons/fa6";

const paymentStatus = {
  PAYMENT_AUTHORIZED: "Payment Secured",
  SELLER_TRANSFER_PENDING: "Waiting for Seller",
  BUYER_CONFIRMED: "Delivery Confirmed",
  CRYPTO_SUBMITTED: "Crypto Submitted",
  RELEASE_READY: "Payment Processing",
  RELEASED: "Payment Completed",
};

const DashboardUsers = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const { data: users, isPending } = useFetchAllUsers();

  const [filters, setFilter] = useState({
    search: "",
    role: "",
  });

  const { search, role } = filters;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

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

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

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

  if (isPending) return <Preloader />;

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
                <th>Joined</th>
                <th>View</th>
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
                      <td>
                        {new Date(user?.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="text-end">
                        <button
                          type="button"
                          title="View Details"
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsModalOpen(true);
                          }}
                        >
                          <FaEye size={20} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
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

      {/* MODAL */}
      {isModalOpen && selectedUser && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            {/* Header */}
            <div className="modal-header d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                {selectedUser.avatar ? (
                  <img
                    className="modal-avatar"
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                    style={{ width: 50, height: 50 }}
                  >
                    {selectedUser.name?.charAt(0)}
                  </div>
                )}

                <div>
                  <h5 className="mb-0">{selectedUser.name}</h5>
                  <small className="text-muted">@{selectedUser.username}</small>
                </div>
              </div>

              <button className="btn-close" onClick={closeModal}></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="row g-3">
                {selectedUser.country && (
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <small className="text-muted d-block">Country</small>
                      <strong className="fs-6">{selectedUser.country}</strong>
                    </div>
                  </div>
                )}

                {selectedUser.city && (
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <small className="text-muted d-block">City</small>
                      <strong className="fs-6">{selectedUser.city}</strong>
                    </div>
                  </div>
                )}

                {selectedUser.zipCode && (
                  <div className="col-md-4">
                    <div className="p-3 border rounded bg-light h-100">
                      <small className="text-muted d-block">Zip Code</small>
                      <strong className="fs-6">{selectedUser.zipCode}</strong>
                    </div>
                  </div>
                )}

                {selectedUser.address && (
                  <div className="col-12">
                    <div className="p-3 border rounded bg-light">
                      <small className="text-muted d-block">Address</small>
                      <strong className="fs-6">{selectedUser.address}</strong>
                    </div>
                  </div>
                )}

                {selectedUser.about && (
                  <div className="col-12">
                    <div className="p-3 border rounded bg-light h-100">
                      <small className="text-muted d-block">About</small>
                      <strong className="fs-6">{selectedUser.about}</strong>
                    </div>
                  </div>
                )}
              </div>

              <h5 className="mt-3 mb-0">Orders</h5>
              {selectedUser.orders && selectedUser.orders.length > 0 ? (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Seller</th>
                      <th>Payment</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.orders.map((order, index) => (
                      <tr key={index}>
                        <td className="text-muted fw-semibold">{index + 1}</td>
                        <td className="text-muted fw-semibold">
                          {order.product?.name}
                        </td>
                        <td className="text-muted fw-semibold">
                          ${order.product?.price}
                        </td>
                        <td className="text-muted fw-semibold">
                          {order.seller?.name ?? "Unknown"}
                        </td>
                        <td className="text-muted fw-semibold">
                          {order.paymentMethod}
                        </td>
                        <td className="text-muted fw-semibold">
                          {paymentStatus[order.status] || order.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No orders found</p>
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer text-end">
              <button className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardUsers;
