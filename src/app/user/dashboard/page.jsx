"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useFetchUserProducts } from "@/queries/fetch-user-products";
import { useFetchBuyerOrders } from "@/queries/buyer-orders";
import Preloader from "@/helper/Preloader";

const page = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const userId = session?.user?.id ?? "";
  const role = session?.user?.role ?? "";

  const isSeller = role === "Seller";
  const isBuyer = role === "Buyer";

  const { data: products, isPending } = useFetchUserProducts(userId);
  const { data: orders } = useFetchBuyerOrders(userId);

  const totalSales = useMemo(() => {
    if (!products || products?.length === 0) return [];

    return products?.filter((item) => item.isSold === true);
  }, [products]);

  const totalEarnings = useMemo(() => {
    if (!totalSales || totalSales?.length === 0) return 0;

    return totalSales?.reduce((sum, item) => {
      return sum + Number(item?.price || 0);
    }, 0);
  }, [totalSales]);

  const isSellerEmpty =
    isSeller &&
    (!products || products.length === 0) &&
    (!orders || orders.length === 0);

  const isBuyerEmpty = isBuyer && (!orders || orders.length === 0);

  if (isPending) return <Preloader />;

  return (
    <div className="dashboard-body__content">
      {/* welcome balance Content Start */}
      <div className="welcome-balance mt-2 mb-40 flx-between gap-2">
        <div className="welcome-balance__left">
          <h4 className="welcome-balance__title mb-0">
            Welcome back! {session?.user?.name ?? ""}
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
                      {orders?.length > 9
                        ? orders?.length
                        : `0${orders?.length}`}
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
                      {totalSales.length > 10
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
      </div>

      {isSellerEmpty && (
        <>
          <div className="empty-state card border-0 shadow-sm mt-24 text-center p-4">
            <div className="mb-3">
              <h5 className="fw-bold">
                🚀 Start selling your first Telegram channel
              </h5>
              <p className="text-muted mb-2">
                It only takes a couple of minutes to get started
              </p>
            </div>

            <div className="mb-3 text-start d-inline-block">
              <p className="mb-1">✔ List your channel in 2 minutes</p>
              <p className="mb-1">✔ Get verified for higher trust</p>
              <p className="mb-1">✔ Reach thousands of buyers</p>
            </div>

            <button
              className="btn btn-primary px-4 py-2.5 mt-2"
              onClick={() => router.push("/user/products/add")}
            >
              Add your first channel
            </button>
          </div>
          <div className="empty-state__stats mt-4">
            <div className="d-flex justify-content-center gap-4 flex-wrap text-muted small">
              <span>
                ⚡ Average channels sell in <strong>7 days</strong>
              </span>
              <span>
                💰 Top sellers earned <strong>$3,200</strong> last month
              </span>
            </div>
          </div>
        </>
      )}

      {isBuyerEmpty && (
        <>
          <div className="card common-card shadow mt-24 p-4">
            <h5 className="mb-3">🔍 Discover Telegram Channels</h5>
            <p className="text-muted mb-4">
              Find high-quality Telegram channels and buy with confidence.
            </p>

            <div className="d-flex flex-column gap-3">
              {/* Benefit 1 */}
              <div className="d-flex align-items-start gap-3">
                <div className="benefit-icon">✔</div>
                <div>
                  <p className="mb-1 fw-500">Browse verified channels</p>
                  <small className="text-muted">
                    Explore trusted listings with verified ownership and
                    authentic data.
                  </small>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="d-flex align-items-start gap-3">
                <div className="benefit-icon">✔</div>
                <div>
                  <p className="mb-1 fw-500">Compare niches and performance</p>
                  <small className="text-muted">
                    Analyze audience, engagement, and category to find the best
                    fit.
                  </small>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="d-flex align-items-start gap-3">
                <div className="benefit-icon">✔</div>
                <div>
                  <p className="mb-1 fw-500">
                    Buy securely with escrow protection
                  </p>
                  <small className="text-muted">
                    Your payment is protected until the channel transfer is
                    completed.
                  </small>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                className="btn btn-primary w-100 fw-semibold fs-6"
                onClick={() => router.push("/all-product")}
              >
                Browse Channels
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default page;
