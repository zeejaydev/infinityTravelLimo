import { FC } from "react";
import { ConfirmationProps } from "../Types";

const Confirmation: FC<ConfirmationProps> = ({
  booking,
  roundTripBooking,
  roundTripError,
  cancel,
  payload,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-[#f36e21] flex items-center justify-between">
        <h1 className="text-xl md:text-3xl uppercase p-5 text-white font-bold">
          Infinity Travel Limo
        </h1>
        <h2 className="text-xl p-5 md:text-2xl font-semibold text-white">
          Trip Confirmation
        </h2>
      </div>
      <div className="p-8 flex-1">
        <h3 className="font-semibold capitalize">Thanks {payload.fname}!</h3>
        <p className="font-medium py-2">
          We will be reviewing your booking request and get back to you shortly
          through text
        </p>
        <div className="flex gap-2">
          <h3 className="font-semibold capitalize">Status:</h3>
          <span>{booking.status}</span>
        </div>
        <div className="flex gap-2">
          <h3 className="font-semibold capitalize">Booking id:</h3>
          <span>{booking.id}</span>
        </div>
        {roundTripBooking && roundTripError == "" && (
          <>
            <h3 className="font-semibold capitalize pt-5">Return Trip</h3>
            <div className="flex gap-2">
              <h3 className="font-semibold capitalize">Status:</h3>
              <span>{roundTripBooking.status}</span>
            </div>
            <div className="flex gap-2">
              <h3 className="font-semibold capitalize">Booking id:</h3>
              <span>{roundTripBooking.id}</span>
            </div>
          </>
        )}
        {roundTripError && (
          <>
            <h3 className="font-semibold capitalize pt-5">Return Trip</h3>
            <div className="flex gap-2">
              <h3 className="font-semibold capitalize">Status:</h3>
              <span>NOT BOOKED</span>
            </div>
            <div className="flex gap-2">
              <h3 className="font-semibold capitalize">Message:</h3>
              <span>{roundTripError}</span>
            </div>
          </>
        )}
      </div>
      <div className=" bg-black p-5 flex justify-center">
        <button
          onClick={() => cancel()}
          className="bg-white px-8 py-2 uppercase font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Confirmation;
