const Hero: React.FunctionComponent = () => {
  return (
    <div
      className="
      bg-no-repeat min-h-[580px] justify-end md:bg-center md:min-h-hero-height h-full"
    >
      <img
        className="hero min-h-[580px] md:min-h-hero-height"
        alt="background"
        srcSet={`https://ik.imagekit.io/zeejaydev/430.jpg 430w,
        https://ik.imagekit.io/zeejaydev/bg.jpg`}
        src="https://ik.imagekit.io/zeejaydev/bg.jpg"
        sizes="100vw"
      />

      <div className="absolute z-2 top-0 right-0 flex h-580px text-white items-center p-4 md:justify-start md:w-1/2">
        <div className="flex flex-col max-w-2xl items-center justify-center h-full mt-24 text-center md:text-left md:items-start">
          <h1 className="text-base pb-1">24/7 online limo booking service</h1>
          <h1 className="text-3xl md:text-4xl capitalize font-extrabold pb-2 md:pb-6">
            enjoy comfortable trip with us
          </h1>
          <p className="pb-2  md:pb-6 text-sm md:text-base">
            Dramatically scale backward compatible portals after market
            positioning deliverables sertively predominate rather.
          </p>

          <a
            className="bg-red-600 px-4 py-2 font-semibold"
            href="#booking"
            rel="noopener noreferrer"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
