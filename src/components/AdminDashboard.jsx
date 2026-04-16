"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";

import Link from "next/link";
import Preloader from "@/helper/Preloader";
import { useFetchProducts } from "@/queries/fetch-products";
import { useOrderTransactions } from "@/queries/transactions";

const paymentStatus = {
  PAYMENT_AUTHORIZED: "Payment Secured",
  SELLER_TRANSFER_PENDING: "Waiting for Seller",
  BUYER_CONFIRMED: "Delivery Confirmed",
  CRYPTO_SUBMITTED: "Crypto Submitted",
  RELEASE_READY: "Payment Processing",
  RELEASED: "Payment Completed",
};

const EarningsChart = dynamic(() => import("./EarningsChart"), {
  ssr: false,
});

const SalesFunnel = dynamic(() => import("./SalesFunnel"), {
  ssr: false,
});

const AdminDashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { data: products, isPending } = useFetchProducts();
  const { data: transactions, isPending: isTransactionPending } =
    useOrderTransactions();

  const totalSales = useMemo(() => {
    if (!products || products?.length === 0) return [];

    return products?.filter((item) => item.isSold === true);
  }, [products]);

  const totalEarnings = useMemo(() => {
    return totalSales.reduce((sum, item) => {
      return sum + Number(item?.price || 0);
    }, 0);
  }, [totalSales]);

  const earningsChartData = useMemo(() => {
    if (!totalSales?.length) return [];

    const grouped = {};

    totalSales.forEach((item) => {
      const dateObj = new Date(item.createdAt);
      const key = dateObj.toISOString().split("T")[0];

      if (!grouped[key]) grouped[key] = 0;
      grouped[key] += Number(item.price || 0);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, earnings]) => ({
        date,
        earnings,
      }));
  }, [totalSales]);

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

  if (isPending || isTransactionPending) return <Preloader />;

  return (
    <div className="dashboard-body__content">
      {/* welcome balance Content Start */}
      <div className="welcome-balance mt-2 mb-40 flx-between gap-2">
        <div className="welcome-balance__left">
          <h4 className="welcome-balance__title mb-0">
            Welcome back! Dealtous
          </h4>
        </div>
        <div className="welcome-balance__right flx-align gap-2">
          <span className="welcome-balance__text fw-500 text-heading">
            Available Balance:
          </span>
          <h4 className="welcome-balance__balance mb-0">
            {totalEarnings > 0 ? `$${totalEarnings}.00` : "$0.00"}
          </h4>
        </div>
      </div>
      {/* welcome balance Content End */}
      <div className="dashboard-body__item-wrapper">
        {/* dashboard body Item Start */}
        <div className="dashboard-body__item">
          <div className="row gy-4">
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-widget">
                <img
                  src="../assets/images/shapes/widget-shape1.png"
                  alt=""
                  className="dashboard-widget__shape one"
                />
                <img
                  src="../assets/images/shapes/widget-shape2.png"
                  alt=""
                  className="dashboard-widget__shape two"
                />
                <span className="dashboard-widget__icon">
                  <img
                    src="../assets/images/icons/dashboard-widget-icon1.svg"
                    alt=""
                  />
                </span>
                <div className="dashboard-widget__content flx-between gap-1 align-items-end">
                  <div>
                    <h4 className="dashboard-widget__number mb-1 mt-3">
                      {products?.length > 9
                        ? products.length
                        : `0${products.length}`}
                    </h4>
                    <span className="dashboard-widget__text font-14">
                      Total Products
                    </span>
                  </div>
                  <img src="../assets/images/icons/chart-icon.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-widget">
                <img
                  src="../assets/images/shapes/widget-shape1.png"
                  alt=""
                  className="dashboard-widget__shape one"
                />
                <img
                  src="../assets/images/shapes/widget-shape2.png"
                  alt=""
                  className="dashboard-widget__shape two"
                />
                <span className="dashboard-widget__icon">
                  <img
                    src="../assets/images/icons/dashboard-widget-icon2.svg"
                    alt=""
                  />
                </span>
                <div className="dashboard-widget__content flx-between gap-1 align-items-end">
                  <div>
                    <h4 className="dashboard-widget__number mb-1 mt-3">
                      {totalEarnings > 0 ? `$${totalEarnings}.00` : "$0.00"}
                    </h4>
                    <span className="dashboard-widget__text font-14">
                      Total Earnings
                    </span>
                  </div>
                  <img src="../assets/images/icons/chart-icon.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-widget">
                <img
                  src="../assets/images/shapes/widget-shape1.png"
                  alt=""
                  className="dashboard-widget__shape one"
                />
                <img
                  src="../assets/images/shapes/widget-shape2.png"
                  alt=""
                  className="dashboard-widget__shape two"
                />
                <span className="dashboard-widget__icon">
                  <img
                    src="../assets/images/icons/dashboard-widget-icon3.svg"
                    alt=""
                  />
                </span>
                <div className="dashboard-widget__content flx-between gap-1 align-items-end">
                  <div>
                    <h4 className="dashboard-widget__number mb-1 mt-3">
                      {transactions?.length > 9
                        ? transactions.length
                        : `0${transactions.length}`}
                    </h4>
                    <span className="dashboard-widget__text font-14">
                      Total Orders
                    </span>
                  </div>
                  <img src="../assets/images/icons/chart-icon.svg" alt="" />
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-sm-6">
              <div className="dashboard-widget">
                <img
                  src="../assets/images/shapes/widget-shape1.png"
                  alt=""
                  className="dashboard-widget__shape one"
                />
                <img
                  src="../assets/images/shapes/widget-shape2.png"
                  alt=""
                  className="dashboard-widget__shape two"
                />
                <span className="dashboard-widget__icon">
                  <img
                    src="../assets/images/icons/dashboard-widget-icon4.svg"
                    alt=""
                  />
                </span>
                <div className="dashboard-widget__content flx-between gap-1 align-items-end">
                  <div>
                    <h4 className="dashboard-widget__number mb-1 mt-3">
                      {totalSales.length > 9
                        ? totalSales.length
                        : `0${totalSales.length}`}
                    </h4>
                    <span className="dashboard-widget__text font-14">
                      Total Sales
                    </span>
                  </div>
                  <img src="../assets/images/icons/chart-icon.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings and Sales Chart */}
        <div className="dashboard-body__item">
          <div className="row g-3">
            <div className="col-lg-8">
              <EarningsChart data={earningsChartData} />
            </div>

            <div className="col-lg-4">
              <SalesFunnel
                products={products?.length}
                orders={transactions?.length}
                sales={totalSales?.length}
              />
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="dashboard-body__item p-3 bg-white rounded shadow-sm">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0 fw-semibold">Recent Transactions</h5>
            <Link
              href="/admin/transactions"
              className="text-primary fw-semibold"
            >
              View All →
            </Link>
          </div>

          {/* Transactions Table */}
          {transactions?.length === 0 ? (
            <div className="py-4">
              <span className="text-muted font-semibold">
                No Transactions Available
              </span>
            </div>
          ) : (
            <div className="table-responsive">
              <table
                className={`table table-hover align-middle ${
                  isDarkMode ? "table-dark text-white" : "table-light text-dark"
                }`}
              >
                <thead className={isDarkMode ? "table-dark" : "table-light"}>
                  <tr>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody className={isDarkMode ? "text-white" : "text-dark"}>
                  {transactions?.slice(0, 3).map((tx) => (
                    <tr key={tx.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {tx.product?.images?.[0] ? (
                            <img
                              src={tx.product?.images[0]}
                              alt={tx.product?.name}
                              className="img-fluid rounded"
                              style={{
                                width: "40px",
                                height: "40px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span className="text-muted small">No Image</span>
                          )}
                          <span className="fw-medium">{tx.product?.name}</span>
                        </div>
                      </td>

                      {/* Buyer */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span>{tx.buyer?.name}</span>
                        </div>
                      </td>

                      {/* Seller */}
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span>{tx.seller?.name}</span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="fw-semibold">${tx.amount}</td>

                      {/* Status */}
                      <td>
                        <span>{paymentStatus[tx.status]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
