import { FC } from "react";
import Quotes from "/images/reviews/quotes.svg";
import { StarIcon } from "@heroicons/react/24/solid";
const Reviews: FC = () => {
  return (
    <section>
      <div className="flex min-h-[70vh] md:min-h-[60vh] flex-col gap-5 3x:gap-0 m-auto justify-center items-center max-w-screen-xl py-10 md:px-5 px-2">
        <div className="text-center flex flex-col pb-10">
          <span className="text-[#f36e21] uppercase font-semibold">
            clients testimonial
          </span>
          <h1 className="text-5xl font-bold capitalize mt-3">
            our happy client's Review
          </h1>
        </div>

        <div className="flex w-full justify-center xl:justify-between gap-6 flex-wrap">
          <div className="relative ">
            <img src="https://ik.imagekit.io/zeejaydev/1.png" alt="" />
            <span className="hidden bg-[#f36e21] w-[90px] h-[90px] absolute md:flex justify-center top-[20px] right-[-40px]">
              <img alt="quotes-mark" src={Quotes} width={45} />
            </span>
          </div>
          <div className="flex flex-col flex-1 max-w-[748px] justify-center p-2">
            <p className="text-justify">
              leave us your awesome review on instagram and we will feature it
              here ASAP...
            </p>
            <div className="flex justify-between items-center mt-5">
              <h1 className="font-semibold text-2xl uppercase text-[#1b1b1b]">
                john doe
              </h1>
              <div className="flex gap-3">
                <StarIcon width={20} color="#f36e21" />
                <StarIcon width={20} color="#f36e21" />
                <StarIcon width={20} color="#f36e21" />
                <StarIcon width={20} color="#f36e21" />
                <StarIcon width={20} color="#f36e21" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
