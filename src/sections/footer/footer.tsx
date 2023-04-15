import { FC, useState } from "react";
import { EnvelopeIcon } from "@heroicons/react/24/solid";
const Footer: FC = () => {
  const [emailAddress, setEmailAddress] = useState<string>("");

  const subscribe = () => {
    if (emailAddress != "") {
      fetch(
        "https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/emailSub",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress,
          }),
        }
      );
    }
  };
  return (
    <div className="bg-[#161921]">
      <div className="max-w-screen-xl flex flex-col md:flex-row md:m-auto flex-wrap p-5 justify-between">
        <div className="flex flex-col h-full mb-10 md:mb-0 flex-1 px-5">
          <h1 className="text-base text-white font-semibold uppercase">
            operating hours
          </h1>
          <div className="flex flex-col text-[#ADADAD] font-semibold pt-1 pb-2 ">
            <span>Sunday: 6am - 11pm</span>
            <span>Monday: 6am - 11pm</span>
            <span>Tuesday: 6am - 11pm</span>
            <span>Wednesday: 6am - 11pm</span>
            <span>Thursday: 6am - 11pm</span>
            <span>Friday: 6am - 11pm</span>
            <span>Saturday: 6am - 11pm</span>
          </div>
          <a
            href="#booking"
            className="bg-[#f36e21] px-4 py-2 font-semibold h-[40px] text-center uppercase"
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
        <div className="flex flex-col flex-1 px-5">
          <h1 className="text-base text-white font-semibold uppercase">
            Emergency Dispatch 24/7
          </h1>
          <p className="text-[#ADADAD] font-semibold pt-1 pb-2">
            Need Help with a quick booking
          </p>
        </div>
        <div className="flex flex-col flex-1 px-5">
          <h1 className="text-base text-white font-semibold uppercase ">
            get coupons
          </h1>
          <span className="text-[#ADADAD] capitalize font-semibold pt-1 pb-2">
            sign up today and get $50 off your new booking
          </span>
          <div className="flex py-4">
            <input
              onChange={(e) => setEmailAddress(e.currentTarget.value)}
              type="email"
              className="w-full px-4 outline-none"
              placeholder="Email Address"
            />
            <button
              onClick={subscribe}
              aria-label="email us button"
              className="w-[55px] h-[55px] flex justify-center items-center bg-[#f36e21]"
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
