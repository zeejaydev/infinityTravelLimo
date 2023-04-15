import { FC } from "react";
import CarCard from "../../components/carCard";
import { CarCardProps } from "../../Types";
import { cars } from "./fleetData";

const OurFleet: FC = () => {
  return (
    <section id="fleet" className="felx flex-col py-10">
      <div className="flex flex-col gap-5 3x:gap-0 m-auto justify-between items-center max-w-screen-xl md:px-5 px-2">
        <span className="text-sm font-semibold text-[#f36e21] uppercase">
          our growing fleet of suvs
        </span>
        <div className="flex flex-wrap gap-5 justify-center">
          {cars.map((car: CarCardProps, index: number) => (
            <CarCard
              key={index}
              imageSrc={car.imageSrc}
              price={car.price}
              smallDes={car.smallDes}
              title={car.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurFleet;
