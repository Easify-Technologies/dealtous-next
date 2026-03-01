import Link from "next/link";

import { FaTelegram } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { ImHeadphones } from "react-icons/im";

const Contact = () => {
  return (
    <section className="contact padding-t-120 padding-b-60 section-bg position-relative z-index-1 overflow-hidden">
      <img
        src="assets/images/gradients/banner-two-gradient.png"
        alt=""
        className="bg--gradient"
      />
      <img
        src="assets/images/shapes/pattern-five.png"
        className="position-absolute end-0 top-0 z-index--1"
        alt=""
      />
      <div className="container container-two">
        <div className="row gy-4">
          <div className="col-lg-5">
            <div className="contact-info__item-wrapper">
              <div className="contact-grid">
                <div className="contact-info__item">
                  <div className="contact-info_icon">
                    <FaPhone size={20} />
                  </div>
                  <Link href="tel:48471503587" className="contact-info__link">
                    48471503587
                  </Link>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info_icon">
                    <MdMarkEmailRead size={20} />
                  </div>
                  <Link
                    href="mailto:support@dealtous.com"
                    className="contact-info__link"
                  >
                    support@dealtous.com
                  </Link>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info_icon">
                    <FaTelegram size={20} />
                  </div>
                  <Link href="#" className="contact-info__link">
                    Telegram
                  </Link>
                </div>

                <div className="contact-info__item">
                  <div className="contact-info_icon">
                    <ImHeadphones size={20} />
                  </div>
                  <Link href="#" className="contact-info__link text-center">
                    09.00am to 10.00pm <br /> (Friday Off)
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7 ps-lg-5">
            <div className="card common-card p-sm-4">
              <div className="card-body">
                <form action="#" autoComplete="off">
                  <div className="row gy-4">
                    <div className="col-sm-6 col-xs-6">
                      <label
                        htmlFor="name"
                        className="form-label mb-2 font-18 font-heading fw-600"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="common-input common-input--grayBg border"
                        id="name"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="col-sm-6 col-xs-6">
                      <label
                        htmlFor="email"
                        className="form-label mb-2 font-18 font-heading fw-600"
                      >
                        Your Mail
                      </label>
                      <input
                        type="email"
                        className="common-input common-input--grayBg border"
                        id="email"
                        placeholder="Your Email"
                      />
                    </div>
                    <div className="col-sm-6 col-xs-6">
                      <label
                        htmlFor="phone"
                        className="form-label mb-2 font-18 font-heading fw-600"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        className="common-input common-input--grayBg border"
                        id="phone"
                        placeholder="Your Phone Number"
                      />
                    </div>
                    <div className="col-sm-6 col-xs-6">
                      <label
                        htmlFor="subject"
                        className="form-label mb-2 font-18 font-heading fw-600"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        className="common-input common-input--grayBg border"
                        id="subject"
                        placeholder="Your Subject"
                      />
                    </div>
                    <div className="col-sm-12">
                      <label
                        htmlFor="message"
                        className="form-label mb-2 font-18 font-heading fw-600"
                      >
                        Your Message
                      </label>
                      <textarea
                        className="common-input common-input--grayBg border"
                        id="message"
                        placeholder="Write Your Message"
                      />
                    </div>
                    <div className="col-sm-12">
                      <button className="btn btn-main btn-lg pill w-100">
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-12">
            <div className="mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12089.730042573583!2d-73.89365413861772!3d40.75251104219687!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25f065951b129%3A0x7f7ec2cb3cea8f1!2sJackson%20Heights%2C%20NY%2011372%2C%20USA!5e0!3m2!1sen!2sin!4v1769678410727!5m2!1sen!2sin"
                width="600"
                height="450"
                style={{ border: "0", width: "100%" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
