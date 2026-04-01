"use client";

import { useSession } from "next-auth/react";

const page = () => {
  const { data: session } = useSession();

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
          <h4 className="welcome-balance__balance mb-0">$0.00</h4>
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
                    <h4 className="dashboard-widget__number mb-1 mt-3">00</h4>
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
                      $0.00
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
                      00
                    </h4>
                    <span className="dashboard-widget__text font-14">
                      Total Downloads
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
                      00
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
    </div>
  );
};

export default page;
