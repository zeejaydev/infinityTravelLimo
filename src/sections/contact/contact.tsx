import { FC } from "react";
import { MapIcon, PhoneIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
const Contact: FC = () => {
  return (
    <div id="contact" className="md:h-[168px] bg-[#1B1F29]">
      <div className="relative max-w-screen-xl m-auto flex flex-col justify-between h-full md:flex-row">
        <div className="flex justify-start md:justify-center px-2 py-5 md:p-0 items-center flex-1 border-l border-l-[#2E3341] gap-4">
          <div className="rounded-full bg-[#f36e21] h-[45px] w-[45px] flex justify-center items-center">
            <EnvelopeIcon width={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#ADADAD] capitalize">email address</span>
            <h1 className="text-base text-white font-semibold">
              info@infinitytravellimo.com
            </h1>
          </div>
        </div>
        <div className="flex justify-start md:justify-center items-center px-2 py-5 md:p-0  flex-1 border-l border-l-[#2E3341] border-r border-r-[#2E3341] gap-4">
          <div className="rounded-full bg-[#f36e21] h-[45px] w-[45px] flex justify-center items-center">
            <PhoneIcon width={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#ADADAD] capitalize">phone number</span>
            <h1 className="text-base text-white font-semibold">
              (123) 321-1234
            </h1>
          </div>
        </div>
        <div className="flex justify-start md:justify-center items-center px-2 py-5 md:p-0  flex-1 border-r border-r-[#2E3341] gap-4">
          <div className="rounded-full bg-[#f36e21] h-[45px] w-[45px] flex justify-center items-center">
            <MapIcon width={20} color="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[#ADADAD] capitalize">address</span>
            <h1 className="text-base text-white font-semibold capitalize">
              salt lake city, utah
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
