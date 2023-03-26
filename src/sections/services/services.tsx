import { FC } from "react";
import ServiceCard from "../../components/serviceCard";
import { serciveCardProps } from "../../Types";
import { serviceCards } from "./servicesHelpers";
const Services: FC = () => {
  return (
    <section
      id="services"
      className="felx flex-col py-10 min-h-[60vh] flex justify-center"
    >
      <div className="flex flex-col gap-5 3x:gap-0 m-auto justify-between items-center max-w-screen-xl md:px-5 px-2">
        <div className="flex flex-col gap-5">
          <span className="text-sm text-[#DB2525] uppercase font-semibold">
            our awesome service fields
          </span>
          <h1 className="text-lg md:text-6xl font-bold capitalize max-w-6xl">
            we make sure your every trip Comfortable
          </h1>
        </div>
        <div className="relative flex flex-wrap justify-center xl:justify-between gap-5 drop-shadow-lg">
          {serviceCards.map((card: serciveCardProps, index: number) => {
            return (
              <ServiceCard
                key={index}
                bgImage={card.bgImage}
                Icon={card.Icon}
                fullDes={card.fullDes}
                smallDes={card.smallDes}
                title={card.title}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
