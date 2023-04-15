import { FC } from "react";

const AboutUs: FC = () => {
  return (
    <section
      id="about"
      className="flex min-h-[70vh] flex-col gap-5 3x:gap-0 3xl:flex-row m-auto justify-between items-center max-w-screen-xl py-10 md:px-5 px-2"
    >
      <img src="https://ik.imagekit.io/zeejaydev/aboutus.png" alt="about us" />

      <div className="flex flex-col gap-3 justify-between">
        <span className="text-sm uppercase text-[#f36e21] font-semibold">
          A little about us
        </span>
        <h1 className="text-5xl font-bold capitalize">
          Our mission is to offer people Comfort and reliabilty
        </h1>

        <p className="text-[#73777A] text-justify p-2">
          Welcome to infinity travel limo, based in the beautiful city of Salt
          Lake City, Utah. We are dedicated to providing reliable and
          comfortable transportation services to our clients who are looking to
          explore the nearby ski areas.
        </p>

        <p className="text-[#73777A] text-justify p-2">
          At our company, we believe that transportation should be more than
          just getting from point A to point B. It should be an enjoyable and
          stress-free experience that sets the tone for your entire day. That's
          why we have a fleet of well-maintained vehicles, driven by experienced
          and courteous drivers who know the local roads like the back of their
          hand. Our mission is to provide safe and efficient transportation
          services to our clients, with a focus on personalized attention and
          customer satisfaction. We are committed to offering a hassle-free
          experience that is tailored to the needs and preferences of our
          clients. Whether you are a solo traveler or part of a large group, we
          have the perfect vehicle to meet your needs. Our fleet includes
          spacious and comfortable SUVs, all equipped with modern amenities to
          ensure a comfortable and enjoyable ride. Our drivers are friendly,
          professional, and reliable, and they will go above and beyond to make
          sure that you have a pleasant and stress-free journey. They are
          knowledgeable about the local area, including the best routes and the
          most popular ski areas, and they are always willing to offer
          recommendations and advice. We are passionate about providing
          excellent service and creating a positive experience for our clients.
          Whether you are traveling for business or pleasure, we are here to
          make your transportation experience as smooth and enjoyable as
          possible.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
