import { FC, useRef, useState } from "react";
import { EnvelopeIcon, CheckIcon } from "@heroicons/react/24/solid";
const Footer: FC = () => {
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [done, setDone] = useState<boolean>(false);

  const subscribe = () => {
    if (emailAddress != "") {
      setLoading(true);
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
      )
        .then(() => (setEmailAddress(""), setDone(true), setLoading(false)))
        .catch((e) => (console.log(e), setLoading(false)));
    }
  };
  return (
    <div className="bg-[#161921]">
      <div className="max-w-screen-xl flex flex-col gap-8 md:gap-0 md:flex-row md:m-auto flex-wrap p-5 justify-between">
        <div className="flex flex-col h-full flex-1 px-5">
          <h1 className="text-base text-white font-semibold uppercase">
            operating hours
          </h1>
          <div className="flex flex-col text-[#ADADAD] font-semibold pt-1 pb-2 ">
            <span>
              Monday-Sunday 6AM - 11pm <br />
              After hours incurs surcharge
            </span>
            {/* <span>Monday: 6am - 11pm</span>
            <span>Tuesday: 6am - 11pm</span>
            <span>Wednesday: 6am - 11pm</span>
            <span>Thursday: 6am - 11pm</span>
            <span>Friday: 6am - 11pm</span>
            <span>Saturday: 6am - 11pm</span> */}
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
            Last minute and short notice booking
            <br />
            Please give us a call
          </p>
          <a
            href="tel:3855291194"
            className="bg-[#f36e21] px-4 py-2 font-semibold h-[40px] text-center uppercase"
            rel="noopener noreferrer"
          >
            Call
          </a>
        </div>
        <div className="flex flex-col flex-1 px-5">
          <h1 className="text-base text-white font-semibold uppercase ">
            get coupons
          </h1>
          <span className="text-[#ADADAD] capitalize font-semibold pt-1 pb-2">
            sign up today and get 20% off your new booking
          </span>
          <div className="flex">
            <input
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.currentTarget.value)}
              type="email"
              className="w-full px-4 outline-none"
              placeholder="Email Address"
            />
            <button
              disabled={done || loading}
              onClick={subscribe}
              aria-label="email us button"
              className="w-[55px] h-[55px] flex justify-center items-center bg-[#f36e21]"
            >
              {loading && (
                <div role="status" className="ml-2">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-5 mr-2 text-gray-600 animate-spin dark:text-white fill-gray-600 dark:fill-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {!done && !loading && (
                <EnvelopeIcon width={16} height={16} color="white" />
              )}
              {done && <CheckIcon height={20} color="white" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
