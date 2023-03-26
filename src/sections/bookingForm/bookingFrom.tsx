import { FC, useEffect, useRef, useState } from "react";
import { formPayload, Input, selectTypes } from "../../Types";
import { inputs, bookingFormMenuTypes, formPayloadMap } from "./formHelpers";

const BookingForm: FC = () => {
  const [selectedType, setSelectedType] = useState<string>(
    selectTypes.fromAirport
  );
  const [payload, setPayload] = useState<formPayload>(formPayloadMap);
  const [activateApi, setActivateApi] = useState<boolean>(false);
  const [mounted, setmounted] = useState<boolean>(false);

  const startDestRef = useRef<HTMLInputElement>(null);
  const endDestRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  const options = {
    componentRestrictions: { country: "us" },
    fields: ["formatted_address", "geometry"],
    strictBounds: false,
    // types: ["address", "airport"],
  };

  // const onChangeAddress = (autocomplete: any) => {
  //   // const location = autocomplete.getPlace();
  //   console.log("got loc");
  // };

  const startDestAutoCompelete = () => {
    //@ts-ignore
    if (!startDestRef.current || !window.google) return;
    //@ts-ignore
    const startDestAutocomplete = new window.google.maps.places.Autocomplete(
      startDestRef.current,
      options
    );
    // console.log("autoCompelteStartDest");
    startDestAutocomplete.addListener(
      "place_changed",
      () => null
      // onChangeAddress(startDestAutocomplete)
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
    // console.log("autoCompleteEndDest");
    endDestAutocomplete.addListener(
      "place_changed",
      () => null
      // onChangeAddress(endDestAutocomplete)
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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    console.log(startDestRef.current?.value);
    console.log(endDestRef.current?.value);
    console.log(payload);
  };

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
    setPayload({ ...payload, [inputName]: value });
  };

  const handleSelectedType = (event: React.MouseEvent<HTMLLIElement>) => {
    if (startDestRef.current != null && startDestRef.current.value.length) {
      startDestRef.current.value = "";
    }
    if (endDestRef.current != null && endDestRef.current.value.length) {
      endDestRef.current.value = "";
    }
    setPayload({ ...payload, roundTrip: "none" });
    setSelectedType(event.currentTarget.textContent ?? selectTypes.fromAirport);
  };

  return (
    <section
      id="booking"
      className="flex flex-col gap-5 3x:gap-0 3xl:flex-row m-auto justify-between items-center max-w-screen-2xl min-h-1/2 py-10 md:px-5 px-2"
    >
      <form onSubmit={submit} className="flex flex-col gap-5 w-full">
        <h1 className="text-5xl font-bold uppercase">Book Your Limo Online</h1>
        <span className="text-sm mt-[-20px] capitalize md:ml-2">
          <span className="text-red-600">*</span> model not guaranteed, Will
          receive a Tahoe, Yukon, or Expedition.
        </span>
        <span className="text-sm mt-[-20px] capitalize md:ml-2">
          <span className="text-red-600">*</span> booking must be 2 days in
          advanced
        </span>
        <div className="flex flex-col md:flex-row min-h-booking-from">
          <ul
            className="bg-bg-dark 
            flex flex-wrap gap-2 px-2 py-5 mb-3 items-center flex-col md:gap-5 text-white font-semibold md:py-10 md:px-5 uppercase md:mr-2 md:mb-0 md:min-w-200px 
            "
          >
            {bookingFormMenuTypes.map((type, index) => (
              <li
                className={`cursor-pointer ${
                  selectedType == type ? "text-[#FF2B2B]" : ""
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
              {inputs.slice(0, 5).map((input: Input, index) => {
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
                  (selectedType == selectTypes.fromAirport ||
                    selectedType == selectTypes.toAirport)
                ) {
                  return (
                    <input
                      key={index}
                      required
                      type={input.type}
                      min={input.min}
                      onChange={(e) => handleSetPayload(e, input.name)}
                      placeholder="Return Date"
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
                selectedType == selectTypes.pointToPoint
                  ? "justify-start gap-5"
                  : "justify-between gap-3"
              } flex-1`}
            >
              {inputs.slice(5).map((input: Input, index) => {
                if (input.name == "dest") {
                  return (
                    <input
                      ref={startDestRef}
                      disabled={selectedType == selectTypes.fromAirport}
                      key={index}
                      required
                      type={input.type}
                      placeholder={
                        selectedType == selectTypes.fromAirport
                          ? "SLC International Airport"
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
                } else if (input.name == "endDest") {
                  return (
                    <input
                      ref={endDestRef}
                      disabled={selectedType == selectTypes.toAirport}
                      key={index}
                      required
                      type={input.type}
                      placeholder={
                        selectedType == selectTypes.toAirport
                          ? "SLC International Airport"
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
                  (selectedType == selectTypes.fromAirport ||
                    selectedType == selectTypes.toAirport)
                ) {
                  return (
                    <input
                      key={index}
                      required
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
                } else if (
                  input.name == "hours" &&
                  selectedType == selectTypes.hourly
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
                    selectedType != selectTypes.hourly &&
                    selectedType != selectTypes.pointToPoint
                  ) {
                    return (
                      <select
                        key={index}
                        required
                        placeholder={input.placeHolder}
                        name={input.name}
                        value={payload.roundTrip}
                        onChange={(e) => handleSetPayload(e, input.name)}
                        className="border-2 
                        h-[70px]
                        p-5 
                        focus:outline-char-black 
                        text-char-black 
                        placeholder-input-place-holder"
                      >
                        <option value="none" disabled hidden>
                          Round Trip ?
                        </option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    );
                  }
                  if (input.type == "select") return;
                  return (
                    <input
                      key={index}
                      required
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
          className="bg-red-600 py-5 px-10 text-white font-semibold"
        >
          Start Booking
        </button>
      </form>
      <img
        className=""
        src="https://ik.imagekit.io/zeejaydev/form-pic.png"
        alt="Tahoe"
      />
    </section>
  );
};
export default BookingForm;
