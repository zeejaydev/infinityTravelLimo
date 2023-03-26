import { lazy, Suspense } from "react";
import Nav from "./components/nav";
import AboutUs from "./sections/about/aboutUs";
import BookingForm from "./sections/bookingForm/bookingFrom";
import Contact from "./sections/contact/contact";
import OurFleet from "./sections/fleet/ourFleet";
import Footer from "./sections/footer/footer";
import Reviews from "./sections/reviews/reviews";
import Services from "./sections/services/services";
// import Hero from "./sections/hero/hero";
const Hero = lazy(() => import("./sections/hero/hero"));
function App() {
  return (
    <>
      <Nav />
      <Hero />
      <OurFleet />
      <BookingForm />
      <Services />
      <AboutUs />
      <Reviews />
      <Contact />
      <Footer />
      <div
        id="footer"
        className="bg-[#1B1F29] h-[60px] flex justify-center items-center"
      >
        <h1 className="text-sm text-white font-semibold">© ZEEJAYDEV 2023</h1>
      </div>
    </>
  );
}

export default App;
