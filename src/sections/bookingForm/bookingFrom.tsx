import { FC, FormEvent, useEffect, useRef, useState } from "react";
import {
  FormPayload,
  Input,
  Locations,
  ModalType,
  selectTypes,
  StartBookingResults,
} from "../../Types";
import { inputs, bookingFormMenuTypes, formPayloadMap } from "./formHelpers";
import BookingModal from "../../components/bookingModal";
import { generateHoursInterval, useClickAway } from "../../utls";
import Modal from "../../components/modal";

const BookingForm: FC = () => {
  const [payload, setPayload] = useState<FormPayload>(formPayloadMap);
  const [activateApi, setActivateApi] = useState<boolean>(false);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [results, setResults] = useState<StartBookingResults | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showHours, setShowHours] = useState<boolean>(false);
  const [showReturnHours, setShowReturnHours] = useState<boolean>(false);
  const [hourValue, setHourValue] = useState<string>("");
  const [returnHourValue, setReturnHourValue] = useState<string>("");
  const startDestRef = useRef<HTMLInputElement>(null);
  const endDestRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const hoursDropDwon = useRef<HTMLDivElement>(null);
  const returnHoursDropDwon = useRef<HTMLDivElement>(null);

  const options = {
    componentRestrictions: { country: "us" },
    fields: ["formatted_address"],
    strictBounds: false,
    // types: ["address", "airport"],
  };

  const startDestAutoCompelete = () => {
    //@ts-ignore
    if (!startDestRef.current || !window.google) return;
    //@ts-ignore
    const startDestAutocomplete = new window.google.maps.places.Autocomplete(
      startDestRef.current,
      options
    );

    startDestAutocomplete.addListener("place_changed", () =>
      setPayload((prev) => ({
        ...prev,
        dest:
          startDestRef.current!.value != prev.dest
            ? startDestRef.current!.value
            : prev.dest,
      }))
    );
  };

  const endDestAutoCompelete = () => {
    //@ts-ignore
    if (!endDestRef.current || !window.google) return;
    //@ts-ignore
    const endDestAutocomplete = new window.google.maps.places.Autocomplete(
      endDestRef.current,
      options
    );

    endDestAutocomplete.addListener("place_changed", () =>
      setPayload((prev) => ({
        ...prev,
        endDest:
          endDestRef.current!.value != prev.endDest
            ? endDestRef.current!.value
            : prev.endDest,
      }))
    );
  };

  useEffect(() => {
    if (!activateApi) {
      // had to wait for index.html to append google places api to the dom
      // 4000ms thats why im waiting here for 4100ms to initiate startDestAutoCompelete
      // and endDestAutoCompelete
      // this is used to get the fastest page load insights
      setTimeout(() => {
        setActivateApi(true);
      }, 4100);
    }

    if (activateApi) {
      startDestAutoCompelete();
      endDestAutoCompelete();
    }
  }, [activateApi]);

  useEffect(() => {
    if (showBookingModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showBookingModal]);

  useClickAway(hoursDropDwon, () => setShowHours(false), showHours);
  useClickAway(
    returnHoursDropDwon,
    () => setShowReturnHours(false),
    showReturnHours
  );

  const handlePhoneNumberChange = (): void => {
    if (!phoneNumberRef.current) return;
    const phoneNumberRefValue = phoneNumberRef.current.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,4})/);
    if (!phoneNumberRefValue) return;
    phoneNumberRef.current.value = !phoneNumberRefValue[2]
      ? phoneNumberRefValue[1]
      : `(${phoneNumberRefValue[1]}) ${phoneNumberRefValue[2]}${`${
          phoneNumberRefValue[3] ? `-${phoneNumberRefValue[3]}` : ""
        }`}${`${phoneNumberRefValue[4] ? `-${phoneNumberRefValue[4]}` : ""}`}`;
    setPayload({ ...payload, ["phone"]: phoneNumberRef.current.value });
  };

  const handleSetPayload = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
    inputName: string
  ): void => {
    const value: string = event.target.value;

    if (inputName === "roundTrip" && value === "no") {
      setPayload({
        ...payload,
        returnDate: "",
        returnTime: "",
        [inputName]: value,
      });
    } else {
      setPayload({ ...payload, [inputName]: value });
    }
  };

  const handleSelectedType = (event: React.MouseEvent<HTMLLIElement>) => {
    if (startDestRef.current != null && startDestRef.current.value.length) {
      startDestRef.current.value = "";
    }
    if (endDestRef.current != null && endDestRef.current.value.length) {
      endDestRef.current.value = "";
    }
    setReturnHourValue("");
    setPayload({
      ...payload,
      roundTrip: "",
      dest:
        event.currentTarget.textContent == selectTypes.fromAirport
          ? Locations.airport
          : "",
      endDest:
        event.currentTarget.textContent == selectTypes.toAirport
          ? Locations.airport
          : "",
      bookingType: event.currentTarget.textContent ?? selectTypes.fromAirport,
    });
  };

  const startBooking = (event: FormEvent) => {
    event.stopPropagation();
    event.preventDefault();
    setLoading(true);
    setShowBookingModal((prev) => !prev);

    const from: string =
      payload.dest != ""
        ? payload.dest
        : payload.bookingType == selectTypes.fromAirport
        ? Locations.airport
        : "";

    const to: string =
      payload.endDest != ""
        ? payload.endDest
        : payload.bookingType == selectTypes.toAirport
        ? Locations.airport
        : "";

    setPayload((prev) => ({ ...prev, dest: from, endDest: to }));

    fetch(
      "https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/quote",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          dest: from,
          endDest: to,
        }),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (errorMessage != null) {
          setErrorMessage(null);
        }
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setResults(res.results);
        }
        setLoading(false);
      })
      .catch((e) => console.log(e));
  };

  return (
    <section
      id="booking"
      className="flex flex-col gap-5 3xl:gap-0 m-auto justify-between items-center max-w-screen-xl min-h-1/2 py-10 md:px-5 px-2"
    >
      <form
        onSubmit={startBooking}
        className="flex flex-col gap-5 w-full pb-10"
      >
        <h1 className="text-5xl font-bold uppercase">Book Your Limo Online</h1>
        <span className="text-sm mt-[-20px]  md:ml-2">
          <span className="text-[#f36e21]">*</span> Model not guaranteed, you
          will receive a Tahoe, Yukon, or Expedition.
        </span>
        <span className="text-sm mt-[-20px]  md:ml-2">
          <span className="text-[#f36e21]">*</span>
          <span> Booking must be 2 days in advance.</span>
        </span>
        <span className="text-sm mt-[-20px] md:ml-2">
          <span className="text-[#f36e21]">*</span> If you don't book from or to
          the airport please choose Point-To-Point.
        </span>
        <span className="text-sm mt-[-20px] md:ml-2">
          <span className="text-[#f36e21]">*</span> Hourly includes only Salt
          Lake, Utah, Davis, Weber, Summit, and Wasatch Counties.
        </span>
        <div className="bg-[#f36e21] w-full p-3 flex gap-4 text-white justify-center items-center text-sm md:text-base">
          <h2 className="md:text-xl uppercase font-semibold">
            Limited Time 20% OFF your total
          </h2>
          <button
            className="py-1 px-3 md:py-2 md:px-5 font-semibold bg-white text-black drop-shadow-xl"
            type="button"
            onClick={() => setShowModal((prev) => !prev)}
          >
            GET IT NOW
          </button>
        </div>
        <div className="flex flex-col md:flex-row min-h-[392px]">
          <ul
            className="bg-bg-dark 
            flex flex-wrap gap-2 px-2 py-5 mb-3 items-center flex-col md:gap-5 text-white font-semibold md:py-10 md:px-5 uppercase md:mr-2 md:mb-0 md:min-w-200px 
            "
          >
            {bookingFormMenuTypes.map((type, index) => (
              <li
                className={`cursor-pointer ${
                  payload.bookingType == type ? "text-[#f36e21]" : ""
                }`}
                key={index}
                onClick={handleSelectedType}
              >
                {type}
              </li>
            ))}
          </ul>

          <div className="flex flex-col md:flex-row gap-3 w-full">
            <div className="flex flex-col gap-3 justify-between flex-1">
              {inputs.slice(0, 6).map((input: Input, index) => {
                if (input.name == "phone") {
                  return (
                    <input
                      key={index}
                      maxLength={input.maxLength}
                      minLength={input.minLength}
                      required
                      ref={phoneNumberRef}
                      onChange={handlePhoneNumberChange}
                      type={input.type}
                      placeholder={input.placeHolder}
                      className="border-2
                          border-input-border
                          p-5
                          focus:outline-char-black
                          text-char-black
                          placeholder-input-place-holder"
                    />
                  );
                } else if (
                  input.name == "returnDate" &&
                  payload.roundTrip == "yes" &&
                  (payload.bookingType == selectTypes.fromAirport ||
                    payload.bookingType == selectTypes.toAirport ||
                    payload.bookingType == selectTypes.pointToPoint)
                ) {
                  return (
                    <input
                      key={index}
                      required
                      type={input.type}
                      min={input.min}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      placeholder={input.placeHolder}
                      className="border-2 
                      border-input-border 
                      p-5 
                      focus:outline-char-black 
                      text-char-black 
                      placeholder-input-place-holder"
                    />
                  );
                } else {
                  if (input.name == "returnDate") return;
                  return (
                    <input
                      key={index}
                      maxLength={input.maxLength}
                      required
                      type={input.type}
                      min={input.min}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      placeholder={input.placeHolder}
                      className="border-2
                          border-input-border 
                          p-5 
                          focus:outline-char-black 
                          text-char-black 
                          placeholder-input-place-holder"
                    />
                  );
                }
              })}
            </div>
            <div
              className={`flex flex-col ${
                payload.bookingType == selectTypes.pointToPoint ||
                payload.bookingType == selectTypes.hourly
                  ? "justify-start gap-3"
                  : "justify-between gap-3"
              } flex-1`}
            >
              {inputs.slice(6).map((input: Input, index) => {
                if (input.name == "dest") {
                  return (
                    <input
                      ref={startDestRef}
                      disabled={payload.bookingType == selectTypes.fromAirport}
                      key={index}
                      required
                      type={input.type}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      placeholder={
                        payload.bookingType == selectTypes.fromAirport
                          ? Locations.airport
                          : input.placeHolder
                      }
                      className="border-2 
                        border-input-border 
                        p-5 
                        focus:outline-char-black 
                        text-char-black 
                        placeholder-input-place-holder"
                    />
                  );
                } else if (
                  input.name == "endDest" &&
                  payload.bookingType != selectTypes.hourly
                ) {
                  return (
                    <input
                      ref={endDestRef}
                      disabled={payload.bookingType == selectTypes.toAirport}
                      key={index}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      required
                      type={input.type}
                      placeholder={
                        payload.bookingType == selectTypes.toAirport
                          ? Locations.airport
                          : input.placeHolder
                      }
                      className="border-2
                        border-input-border
                        p-5
                        focus:outline-char-black
                        text-char-black
                        placeholder-input-place-holder"
                    />
                  );
                } else if (
                  input.name == "returnTime" &&
                  payload.roundTrip == "yes" &&
                  (payload.bookingType == selectTypes.fromAirport ||
                    payload.bookingType == selectTypes.toAirport ||
                    payload.bookingType == selectTypes.pointToPoint)
                ) {
                  return (
                    <div className="relative" key={index}>
                      <input
                        readOnly
                        onClick={() => setShowReturnHours(true)}
                        placeholder={`Return Time`}
                        value={
                          returnHourValue != ""
                            ? `Return Time ${returnHourValue}`
                            : ""
                        }
                        className="border-2 w-full
                          border-input-border 
                          p-5 
                          focus:outline-char-black 
                          text-char-black 
                          placeholder-input-place-holder"
                      />
                      {showReturnHours && (
                        <div
                          ref={returnHoursDropDwon}
                          className="inline-block border outline-char-black  w-full absolute top-[70px] left-0 bg-white max-h-[200px] z-20 overflow-y-auto md:drop-shadow-xl"
                        >
                          <div className="flex flex-col text-justify">
                            {generateHoursInterval(60 * 0, 60 * 24, 15).map(
                              (time, idx) => (
                                <span
                                  key={idx}
                                  onClick={() => (
                                    setPayload((prev) => ({
                                      ...prev,
                                      [input.name]: (time.split(" ")[1] == "PM"
                                        ? parseInt(
                                            time.split(" ")[0].split(":")[0]
                                          ) +
                                          12 +
                                          ":" +
                                          time.split(" ")[0].split(":")[1]
                                        : time.split(" ")[0].split(":")[0] ===
                                          "12"
                                        ? time.split(" ")[0].replace("12", "00")
                                        : time.split(" ")[0]
                                      ).toString(),
                                    })),
                                    setReturnHourValue(time),
                                    setShowReturnHours(false)
                                  )}
                                  className="text-base font-semibold w-full py-2 hover:bg-black/10 cursor-pointer flex"
                                >
                                  <span className="w-[80] m-auto">{time}</span>
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else if (
                  input.name == "hours" &&
                  payload.bookingType == selectTypes.hourly
                ) {
                  return (
                    <input
                      key={index}
                      required
                      min={input.min}
                      type={input.type}
                      placeholder={input.placeHolder}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      className="border-2 
                    border-input-border 
                    p-5 
                    focus:outline-char-black 
                    text-char-black 
                    placeholder-input-place-holder"
                    />
                  );
                } else {
                  if (
                    input.name == "dest" ||
                    input.name == "endDest" ||
                    input.name == "returnTime" ||
                    input.name == "hours"
                  )
                    return;
                  if (
                    input.type == "select" &&
                    payload.bookingType != selectTypes.hourly
                  ) {
                    return (
                      <select
                        key={index}
                        required
                        placeholder={input.placeHolder}
                        name={input.name}
                        value={payload.roundTrip}
                        onChange={(e) => handleSetPayload(e, input.name)}
                        className={`border-2 
                        h-[70px]
                        p-5 
                        focus:outline-char-black 
                        ${
                          payload.roundTrip === ""
                            ? "-input-place-holder"
                            : "text-char-black "
                        } 
                        placeholder-input-place-holder`}
                      >
                        <option value="" hidden>
                          Round Trip
                        </option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    );
                  }
                  if (input.type == "select") return;

                  if (input.name == "time") {
                    return (
                      <div className="relative" key={index}>
                        <input
                          readOnly
                          onClick={() => setShowHours(true)}
                          placeholder={`Time`}
                          value={hourValue != "" ? `Time ${hourValue}` : ""}
                          className="border-2 w-full
                          border-input-border 
                          p-5 
                          focus:outline-char-black 
                          text-char-black 
                          placeholder-input-place-holder"
                        />
                        {showHours && (
                          <div
                            ref={hoursDropDwon}
                            className="inline-block border outline-char-black  w-full absolute top-[70px] left-0 bg-white max-h-[200px] z-20 overflow-y-auto md:drop-shadow-xl"
                          >
                            <div className="flex flex-col text-justify">
                              {generateHoursInterval(60 * 0, 60 * 24, 15).map(
                                (time, idx) => (
                                  <span
                                    key={idx}
                                    onClick={() => (
                                      setPayload((prev) => ({
                                        ...prev,
                                        [input.name]: (time.split(" ")[1] ==
                                        "PM"
                                          ? parseInt(
                                              time.split(" ")[0].split(":")[0]
                                            ) +
                                            12 +
                                            ":" +
                                            time.split(" ")[0].split(":")[1]
                                          : time.split(" ")[0].split(":")[0] ===
                                            "12"
                                          ? time
                                              .split(" ")[0]
                                              .replace("12", "00")
                                          : time.split(" ")[0]
                                        ).toString(),
                                      })),
                                      setHourValue(time),
                                      setShowHours(false)
                                    )}
                                    className="text-base font-semibold w-full py-2 hover:bg-black/10 cursor-pointer flex"
                                  >
                                    <span className="w-[80] m-auto">
                                      {time}
                                    </span>
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return (
                    <input
                      key={index}
                      // required
                      type={input.type}
                      placeholder={input.placeHolder}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      className="border-2 
                        border-input-border 
                        p-5 
                        focus:outline-char-black 
                        text-char-black 
                        placeholder-input-place-holder"
                    />
                  );
                }
              })}
            </div>
          </div>
        </div>
        <textarea
          rows={2}
          placeholder="Comments"
          onChange={(e) => handleSetPayload(e, "comments")}
          className="border-2
            border-input-border
            p-5
            focus:outline-char-black
            text-char-black
            placeholder-input-place-holder"
        />
        <button
          type="submit"
          className="bg-[#f36e21] py-5 px-10 text-white font-semibold"
        >
          Start Booking
        </button>
      </form>
      {/* <img
        className=""
        src="https://ik.imagekit.io/zeejaydev/form-pic.png"
        alt="Tahoe"
      /> */}
      {showBookingModal && (
        <BookingModal
          payload={payload}
          setResults={setResults}
          setErrorMessage={setErrorMessage}
          loading={loading}
          results={results}
          setShowBookingModal={setShowBookingModal}
          errorMessage={errorMessage}
        />
      )}
      {showModal && (
        <Modal
          setCloseModal={setShowModal}
          title="subscribe"
          description="by subscribing to our email list you get a 20% off your booking total price"
          modalType={ModalType.emailCaptuer}
          isModalOpen={showModal}
        />
      )}
    </section>
  );
};
export default BookingForm;
