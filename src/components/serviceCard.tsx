import { FC, useState } from "react";
import { serciveCardProps } from "../Types";
import { XMarkIcon } from "@heroicons/react/24/solid";
const ServiceCard: FC<serciveCardProps> = ({
  bgImage,
  fullDes,
  Icon,
  smallDes,
  title,
}: serciveCardProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <>
      <div
        className="relative md:w-card h-card bg-white p-10"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="py-5">
          <span className="flex justify-center w-20 h-20 bg-[#f36e21]">
            {<Icon width={45} color="white" />}
          </span>
        </div>
        <div className="relative flex flex-col justify-between min-h-[160px]">
          <h1
            className={`${
              bgImage.length ? "text-white" : "text-black"
            } text-xl font-semibold uppercase`}
          >
            {title}
          </h1>
          <p
            className={`text-sm text-input-place-holder ${
              bgImage.length ? "text-white" : "text-black"
            }`}
          >
            {smallDes}
          </p>
          <button
            onClick={() => setShowDetails((prev) => !prev)}
            className={`border-2 border-w py-3 px-5 w-[150px] font-semibold ${
              bgImage.length ? "text-white" : "text-black"
            }`}
          >
            Read Details
          </button>
        </div>
        <div
          className={`absolute w-card bg-white bottom-0 left-0 ${
            showDetails
              ? "h-card transition-all duration-500 ease-out"
              : "h-0 transition-all duration-500 ease-out"
          } `}
        >
          {showDetails && (
            <div className="flex flex-col items-center p-10">
              <XMarkIcon
                className="pb-4 text-center cursor-pointer"
                width={28}
                onClick={() => setShowDetails((prev) => !prev)}
              />

              <p>{fullDes}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ServiceCard;
