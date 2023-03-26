import { FC } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
const Footer: FC = () => {
  return (
    <div className="bg-[#161921]">
      <div className="max-w-screen-lg flex flex-col md:flex-row md:m-auto flex-wrap p-5 justify-between">
        <div className="flex flex-col h-full mb-10 md:mb-0">
          <h1 className="text-base text-white font-semibold uppercase">
            operating hours
          </h1>
          <div className="flex flex-col text-[#ADADAD] font-semibold pt-1 pb-2 ">
            <span>Sunday: 7am - 12am</span>
            <span>Monday: 7am - 12am</span>
            <span>Tuesday: 7am - 12am</span>
            <span>Wednesday: 7am - 12am</span>
            <span>Thursday: 7am - 12am</span>
            <span>Friday: 7am - 12am</span>
            <span>Saturday: 7am - 12am</span>
          </div>
          <a
            href="#booking"
            className="bg-red-600 px-4 py-2 font-semibold h-[40px] text-center uppercase"
            rel="noopener noreferrer"
          >
            book now
          </a>
        </div>
        {/* <div className="flex flex-1">
          <h1 className="text-base text-white font-semibold uppercase">
            latest posts form instagram
            <div className="flex justify-between">
              <div className="relative w-[110px]">
                <img
                  src="/images/reviews/1.png"
                  width={110}
                  className="object-contain"
                  alt=""
                />
              </div>
              <div className="flex flex-col">
                <span>Mar 24 2023</span>
              </div>
            </div>
          </h1>
        </div> */}
        <div className="flex flex-col">
          <h1 className="text-base text-white font-semibold uppercase">
            get coupons
          </h1>
          <span className="text-[#ADADAD] capitalize">
            sign up today and get $50 off your new booking
          </span>
          <div className="flex py-4">
            <input
              type="email"
              className="w-full px-4 outline-none"
              placeholder="Email Address"
            />
            <button
              aria-label="email us button"
              className="w-[55px] h-[55px] flex justify-center items-center bg-red-600"
            >
              <EnvelopeIcon width={16} height={16} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
