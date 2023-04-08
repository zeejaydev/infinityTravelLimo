import { FC, useEffect, useRef, useState } from "react";
import { CarCardProps } from "../Types";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { images } from "./imagesData";
import { useClickAway } from "../utls";

const CarCard: FC<CarCardProps> = ({
  imageSrc,
  price,
  smallDes,
  title,
}: CarCardProps) => {
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [imageToShow, setImageToShow] = useState<number>(0);

  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setShowLightbox(false), showLightbox);

  const handleNextImage = () => {
    if (imageToShow + 1 == images.length) return;
    setImageToShow((prev) => prev + 1);
  };

  const handlePrevImage = () => {
    if (imageToShow - 1 < 0) return;
    setImageToShow((prev) => prev - 1);
  };

  return (
    <>
      <div className="relative flex flex-col items-center md:w-[371px] max-h-[504px]">
        <div className="relative w-full min-h-[300px] bg-[#F6F6F6]">
          <img
            width={"95%"}
            style={{ padding: 10, marginLeft: 10 }}
            src={imageSrc}
            alt=""
          />
        </div>
        <div
          className="flex justify-center flex-wrap items-center absolute h-[100px] w-[100px] bg-red-600 top-[200px] z-20 border-[7px]"
          style={{ borderColor: "#F6F6F6", borderRadius: "50%" }}
        >
          <div className="flex flex-col items-center ">
            <span className="font-semibold text-white text-lg uppercase mr-1">
              ${price}
            </span>
            <span className="text-white text-xs mt-[-5px] ">3 HOURS</span>
          </div>
        </div>
        <div className="relative flex flex-col justify-end bottom-[55px] w-[310px] min-h-[253px] bg-[#1B1B1B]">
          <div className="relative bottom-[30px] flex flex-col items-center gap-4 justify-around min-h-[160px]">
            <div className="text-center">
              <h1 className="font-semibold text-white text-2xl uppercase">
                {title}
              </h1>
              <h2 className=" text-white text-base uppercase pt-2">
                {smallDes}
              </h2>
            </div>
            <button
              onClick={() => setShowLightbox(true)}
              className="bg-red-600 py-3 px-6 text-white uppercase text-sm font-semibold"
            >
              view images
            </button>
          </div>
        </div>
      </div>

      {showLightbox && (
        <div
          className="fixed h-screen w-screen z-50 top-0 flex justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div
            ref={ref}
            className="relative flex w-[90%] max-w-[1500px] m-auto items-center"
          >
            <div
              className={`absolute z-40 backdrop-blur-lg bg-white/50 
            w-[30px] h-[30px] md:w-[60px] md:h-[60px] items-center m-4 flex justify-center rounded-md`}
            >
              <ChevronLeftIcon
                color="black"
                className="cursor-pointer h-[30px] w-[30px] md:h-[50px] md:w-[50px]"
                onClick={handlePrevImage}
              />
            </div>
            <div className="relative w-screen max-h-[90vh] flex justify-center">
              <img
                width={"100%"}
                src={images[imageToShow]}
                alt=""
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              className={`absolute z-40 backdrop-blur-sm bg-white/50 
              w-[30px] h-[30px] md:w-[60px] md:h-[60px] items-center m-4 flex justify-center rounded-md right-0`}
            >
              <ChevronRightIcon
                onClick={handleNextImage}
                className="cursor-pointer h-[30px] w-[30px] md:h-[50px] md:w-[50px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarCard;
