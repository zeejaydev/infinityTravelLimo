import { FC, useState } from "react";
import {
  PhoneIcon,
  EnvelopeIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
const Nav: FC = () => {
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  return (
    <div
      className="flex flex-col bg-transparent absolute top-1 h-[125px] z-10"
      style={{ width: "100%" }}
    >
      <div className="flex flex-row justify-between">
        <h1 className="text-white hidden md:flex md:text-base  capitalize md:pl-6">
          Welcome to infinity travel limo
        </h1>
        <div className="flex w-full px-5 md:px-0  justify-between text-white md:w-1/2">
          <span className="flex items-center">
            <PhoneIcon className="h-4 w-4 text-white" />
            <a href="tel:3855291194" className="pl-2 text-sm">
              (385) 529-1194
            </a>
          </span>
          <span className="flex items-center">
            <EnvelopeIcon className="h-4 w-4 text-white" />
            <a
              href="mailto:info@infinitytravellimo.com"
              target="_blank"
              className="pl-2 text-sm"
            >
              info@infinitytravellimo.com
            </a>
          </span>
          <span className="pl-2 text-sm hidden lg:block">social media</span>
        </div>
      </div>
      <div className="flex justify-between mt-0">
        <div
          className="relative flex justify-center w-[150px] h-[75px] md:w-[240px] lg:w-80 items-center text-white md:h-20 
        backdrop-blur-lg bg-black/20 border-r-4 border-[#f36e21] 
        font-bold text-4xl"
        >
          <img
            src="/assets/logo2.png"
            className="h-[50%] object-contain md:h-[52px]"
            alt=""
          />
        </div>

        <ul className="hidden text-white md:flex h-20 backdrop-blur-lg bg-black/20 w-1/2 items-center justify-around uppercase">
          <li>
            <a
              href="#"
              className="hover:border-b-2 border-[#f36e21] ease-in-out duration-75"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#services"
              className="hover:border-b-2 border-[#f36e21] ease-in-out duration-75"
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#about"
              className="hover:border-b-2 border-[#f36e21] ease-in-out duration-75"
            >
              About Us
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:border-b-2 border-[#f36e21] ease-in-out duration-75"
            >
              Contact
            </a>
          </li>
        </ul>
        <span className="flex justify-center px-5 md:hidden">
          <Bars3Icon
            className="cursor-pointer"
            color="white"
            width={50}
            onClick={() => setShowDrawer((prev) => !prev)}
          />
        </span>
      </div>

      {/* mobile drawer */}
      <div
        className={`fixed z-30 flex flex-col items-center right-0 top-0 min-h-screen w-2/4 bg-white md:hidden ${
          showDrawer
            ? "transition-all duration-500 ease-out"
            : "translate-x-full duration-500 ease-out"
        } `}
      >
        <XMarkIcon
          width={45}
          className="py-10 cursor-pointer"
          onClick={() => setShowDrawer((prev) => !prev)}
        />

        <div className="w-full flex flex-col items-center gap-5 uppercase">
          <a
            href="#"
            className="pb-2 border-b w-full text-center  cursor-pointer text-black hover:text-black"
          >
            Home
          </a>
          <a
            href="#about"
            className="pb-2 border-b w-full text-center  cursor-pointer text-black hover:text-black"
          >
            About Us
          </a>
          <a
            href="#services"
            className="pb-2 border-b w-full text-center  cursor-pointer text-black hover:text-black"
          >
            Services
          </a>
          <a
            href="#contact"
            className="pb-2 border-b w-full text-center  cursor-pointer text-black hover:text-black"
          >
            Contact
          </a>
        </div>
      </div>
    </div>
  );
};

export default Nav;
