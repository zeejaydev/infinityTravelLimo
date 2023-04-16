import {
  ChangeEvent,
  FC,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Booking,
  BookingModalProps,
  BookingResponse,
  CouponResp,
  selectTypes,
} from "../Types";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
import { CheckIcon } from "@heroicons/react/24/solid";
import Confirmation from "./confirmation";
import CurrencyInput from "./CurrencyInput";
const BookingModal: FC<BookingModalProps> = ({
  loading,
  results,
  setShowBookingModal,
  errorMessage,
  setResults,
  setErrorMessage,
  payload,
}: BookingModalProps) => {
  const [disablePayButton, setDisablePayButton] = useState<boolean>(true);
  const [checkBox, setCheckBox] = useState<boolean>(false);
  const [address, setAddress] = useState<string>("");
  const [zip, setZip] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [bookingCompleted, setBookingCompleted] = useState<Booking | null>(
    null
  );
  const [roundTripBooking, setRoundTripBooking] = useState<Booking | null>(
    null
  );
  const [roundTripBookingError, setRoundTripBookingError] =
    useState<string>("");
  const [checkingCoupon, setCheckingCoupon] = useState<boolean>(false);
  const [couponError, setCoupoError] = useState<string | null>(null);
  const [couponApplied, setCouponApplied] = useState<boolean>(false);
  const [newTotal, setNewTotal] = useState<string | null>(null);
  const [couponUsed, setCouponUsed] = useState<string>("");
  const [tipAmount, setTipAmount] = useState<string | undefined>("0");
  const [toggleTipButtonState, setToggleTipButtonState] = useState<number>(0);
  const zipRef = useRef<HTMLInputElement>(null);
  const couponRef = useRef<HTMLInputElement>(null);
  const tip1Ref = useRef<HTMLButtonElement>(null);
  const tip2Ref = useRef<HTMLButtonElement>(null);
  const tip3Ref = useRef<HTMLButtonElement>(null);
  const tipInput = useRef<HTMLInputElement>(null);

  const cancel = (): void => {
    setShowBookingModal(false);
    setErrorMessage(null);
    setProcessing(false);
    setResults(null);
  };

  useEffect(() => {
    if (
      zip.length == 5 &&
      address != "" &&
      firstName.trim().length > 1 &&
      lastName.trim().length > 1 &&
      checkBox
    ) {
      setDisablePayButton(false);
    } else {
      setDisablePayButton(true);
    }
  }, [zip, address, firstName, lastName, checkBox]);

  const handleSetZip = () => {
    if (!zipRef.current) return;
    const regex: RegExp = /\d/g;
    zipRef.current.value = regex.test(zipRef.current.value)
      ? zipRef.current.value.replace(/\D/g, "")
      : "";
    setZip(zipRef.current.value.replace(/\D/g, ""));
  };

  const handleFirstNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setFirstName(value);
  };
  const handleLastNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setLastName(value);
  };
  const handleAdderssChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;
    setAddress(value);
  };

  const bookNow = async (token: string, last4: string | undefined) => {
    // console.log(payload);
    fetch(
      "https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/startBooking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          flightNumber:
            payload.flightNumber != "" ? payload.flightNumber : "Unknown",
          price: results?.price ?? "",
          token: token,
          address: address,
          zip: zip,
          firstName: firstName,
          lastName: lastName,
          couponUsed: couponUsed,
          newTotal: newTotal,
          tipAmount: tipAmount,
          cardLast4: last4 ?? "",
        }),
      }
    )
      .then((res) => res.json())
      .then((response: BookingResponse) => {
        if (response.error) {
          setProcessing(false);
          setErrorMessage(response.error);
          setResults(null);
        } else if (response.booking) {
          setProcessing(false);
          setResults(null);
          setBookingCompleted(response.booking.booking);
          if (
            response.roundTripBooking &&
            !response.roundTripBooking.roundTripError
          ) {
            setRoundTripBooking(response.roundTripBooking.booking);
          } else if (response.roundTripBooking?.roundTripError) {
            setRoundTripBookingError(
              response.roundTripBooking?.roundTripError ?? ""
            );
          }
        } else {
          setProcessing(false);
          setResults(null);
          // console.log(response);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const checkCoupon = () => {
    if (!couponRef.current) return;
    if (couponRef.current.value != "") {
      setCheckingCoupon(true);
      setCoupoError(null);
      setCouponApplied(false);
      const coupon = couponRef.current.value;
      fetch(
        `https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/validateCoupon?coupon=${coupon}&email=${payload.email}`
      )
        .then((res) => res.json())
        .then((resp: CouponResp) => {
          if (!results) return;
          if (resp.error) {
            setCoupoError(resp.error);
            setNewTotal(null);
          } else {
            const percentage = resp.percentage;
            const active = resp.active;
            if (active) {
              const total = results?.price;
              const discountPrice = (percentage / 100) * total;
              const newTotal = `$${(total - discountPrice).toFixed(2)}`;
              setNewTotal(newTotal);

              setCouponApplied(true);
              setCouponUsed(coupon);
            }
          }
          setCheckingCoupon(false);
        });
    } else {
      couponRef.current.focus();
      couponRef.current.classList.add("focus:outline-red-500");
    }
  };

  // const validateValue = (value: string | undefined): void => {
  //   console.log(value);
  //   const rawValue = value === undefined ? "undefined" : value;
  //   setToggleTipButtonState(0);
  //   if (value === "") {
  //     return setTipAmount("0");
  //   } else if (Number.isNaN(Number(value))) {
  //     return setTipAmount("0");
  //   } else {
  //     setTipAmount(rawValue || "0");
  //   }
  // };

  const handleTipButton = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    // if (tipInput.current && tipInput.current.value != " ") {
    //   console.log(tipInput.current?.value);
    //   tipInput.current.value = "undefined";
    // }
    if (!results) return;
    const percentage = event.currentTarget.textContent;

    switch (percentage) {
      case "18%":
        if (toggleTipButtonState === 18) {
          setToggleTipButtonState(0);
          setTipAmount("0");
          return;
        }
        setToggleTipButtonState(18);
        const total = results?.price;
        const tip = (18 / 100) * total;
        setTipAmount(tip.toFixed(2).toString());
        break;
      case "20%":
        if (toggleTipButtonState === 20) {
          setToggleTipButtonState(0);
          setTipAmount("0");
          return;
        }
        setToggleTipButtonState(20);
        const total20 = results?.price;
        const tip20 = (20 / 100) * total20;
        setTipAmount(tip20.toFixed(2).toString());
        break;
      case "25%":
        if (toggleTipButtonState === 25) {
          setToggleTipButtonState(0);
          setTipAmount("0");
          return;
        }
        setToggleTipButtonState(25);
        const total25 = results?.price;
        const tip25 = (25 / 100) * total25;
        setTipAmount(tip25.toFixed(2).toString());
        break;
      default:
        break;
    }
  };
  return (
    <div
      className={`fixed bg-[rgb(0,0,0,0.5)] min-h-[100vh]
         min-w-[100vw] z-[900] top-0 flex justify-center items-center
         left-0`}
    >
      <div
        // ref={bg}
        // className="bg-white h-[95vh] w-screen md:w-[90vw] 2xl:max-w-[1500px] rounded-lg p-5"
        className={`bg-white ${
          bookingCompleted ? "" : "h-screen"
        } w-screen rounded-lg overflow-auto ${
          bookingCompleted ? "" : "md:max-h-[1020px]"
        } md:w-[920px]`}
      >
        {loading && errorMessage == null && (
          <div className="flex h-full w-full justify-center items-center p-8">
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            {/* <button onClick={cancel}>cancel</button> */}
          </div>
        )}

        {errorMessage != null && (
          <div className="flex h-full w-full items-center flex-col justify-center p-8">
            <span className="capitalize">{errorMessage}</span>
            <button
              onClick={cancel}
              type="button"
              className="bg-input-place-holder py-3 w-full px-10 text-white font-semibold uppercase pt-3"
            >
              close
            </button>
          </div>
        )}

        {results && (
          <div className="flex w-full flex-col p-8 gap-4">
            <div className="">
              <h1 className="text-xl font-semibold border-b-2">
                Trip Information
              </h1>
              {results.cars > 1 && (
                <p className="font-semibold text-center mb-2 text-red-500">
                  Too many Passengers for one vehicle we quoted you for{" "}
                  {results.cars} cars, for any special accommodations please
                  give us a call at (385) 529-1194
                </p>
              )}
              <table className="table-auto">
                <tbody>
                  <tr>
                    <td>Service:</td>
                    <td>{payload.bookingType}</td>
                  </tr>
                  <tr>
                    <td>Vehicle Type:</td>
                    <td>{results.cars > 1 && results.cars} Full Size SUV</td>
                  </tr>
                  <tr>
                    <td>Passengers:</td>
                    <td>{payload.nop}</td>
                  </tr>
                  <tr>
                    <td>Pickup Time:</td>
                    <td>
                      {new Date(
                        payload.date + " " + payload.time
                      ).toLocaleTimeString([], { timeStyle: "short" })}
                    </td>
                  </tr>
                  <tr>
                    <td>Pickup Location:</td>
                    <td className="max-w-[200px] sm:max-w-[500px] md:max-w-[700px] whitespace-nowrap overflow-hidden text-ellipsis">
                      {payload.dest}
                    </td>
                  </tr>
                  {payload.bookingType != selectTypes.hourly && (
                    <tr>
                      <td>Drop off Location:</td>
                      <td className="max-w-[200px] sm:max-w-[500px] md:max-w-[700px] whitespace-nowrap overflow-hidden text-ellipsis">
                        {payload.endDest}
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td>Pickup date:</td>
                    <td>{new Date(payload.date).toDateString()}</td>
                  </tr>
                  {payload.bookingType != selectTypes.hourly && (
                    <tr>
                      <td>Round Trip:</td>
                      <td>{payload.roundTrip}</td>
                    </tr>
                  )}
                  {payload.roundTrip == "yes" &&
                    payload.bookingType != selectTypes.hourly && (
                      <>
                        <tr>
                          <td>return time</td>
                          <td>
                            {new Date(
                              payload.date + " " + payload.returnTime
                            ).toLocaleTimeString([], { timeStyle: "short" })}
                          </td>
                        </tr>
                        <tr>
                          <td>return Date:</td>
                          <td>{new Date(payload.returnDate).toDateString()}</td>
                        </tr>
                      </>
                    )}
                  {payload.bookingType != selectTypes.hourly && (
                    <tr>
                      <td>Distance:</td>
                      <td>{results.distance}</td>
                    </tr>
                  )}
                  <tr>
                    <td>duration:</td>
                    <td>{results.duration}</td>
                  </tr>
                  <tr className="border-t-2">
                    <td>EST Total:</td>
                    <td>
                      <span
                        className={`${
                          newTotal ? "line-through text-red-400" : ""
                        }`}
                      >
                        {results.price.toLocaleString("en-us", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                      {newTotal && <span className="ml-2">{newTotal}</span>}
                    </td>
                  </tr>
                  <tr>
                    <td>Tip</td>
                    <td>
                      <span>${tipAmount}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <h1 className="text-xl font-semibold pt-3 border-b-2">
                Client Information
              </h1>
              <table className="table-auto">
                <tbody>
                  <tr>
                    <td>Name:</td>
                    <td>{payload.fname}</td>
                  </tr>
                  <tr>
                    <td>Phone number:</td>
                    <td>{payload.phone}</td>
                  </tr>
                  <tr>
                    <td>Email:</td>
                    <td>{payload.email}</td>
                  </tr>
                  <tr>
                    <td>Flight Info:</td>
                    <td>
                      {payload.flightNumber != ""
                        ? payload.flightNumber
                        : "unknown"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col md:flex-row gap-2 md:items-center py-2">
                <label htmlFor="coupon" className="text-sm">
                  Coupon
                </label>
                <input
                  ref={couponRef}
                  id="coupon"
                  type="text"
                  onChange={() =>
                    couponRef.current?.classList.remove("focus:outline-red-500")
                  }
                  className="border-2 h-[30px]
                  border-input-border
                  p-3
                  focus:outline-char-black
                  text-char-black
                  placeholder-input-place-holder"
                />
                <button
                  onClick={checkCoupon}
                  className="h-[30px] px-5 border-2 text-sm uppercase"
                >
                  apply
                </button>
                {checkingCoupon && (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                )}
                {couponError && <p>{couponError}</p>}
                {couponApplied && <CheckIcon height={20} color="green" />}
              </div>
              <div className="flex flex-col md:flex-row gap-3 py-2 md:items-center">
                <span className="text-sm mr-8">Tip</span>
                <div className="">
                  <button
                    ref={tip1Ref}
                    onClick={handleTipButton}
                    className={` px-4 py-1 border border-[#bec3c8] rounded-l-lg text-[#161a1d] font-semibold ${
                      toggleTipButtonState === 18 ? "active" : ""
                    }`}
                  >
                    18%
                  </button>
                  <button
                    ref={tip2Ref}
                    onClick={handleTipButton}
                    className={`px-4 py-1 border-t border-b border-[#bec3c8] text-[#161a1d] font-semibold ${
                      toggleTipButtonState === 20 ? "active" : ""
                    }`}
                  >
                    20%
                  </button>
                  <button
                    ref={tip3Ref}
                    onClick={handleTipButton}
                    className={`px-4 py-1 rounded-r-lg text-[#161a1d] font-semibold border-[#bec3c8] border ${
                      toggleTipButtonState === 25 ? "active" : ""
                    }`}
                  >
                    25%
                  </button>
                </div>
                {/* <CurrencyInput
                  placeholder="Other"
                  ref={tipInput}
                  allowDecimals={false}
                  className="outline-none focus:border-b border-[#bec3c8] md:max-w-[80px]"
                  onValueChange={validateValue}
                  prefix={"$"}
                  step={10}
                  min={0}
                /> */}
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold p-0 m-0">
                Terms & Conditions
              </h1>
              <div className="max-h-[150px] overflow-y-scroll border-2 rounded-md">
                <p className="p-2">
                  Thank you for choosing Infinity Travel for your transportation
                  needs.
                  <br />
                  Our rate includes all applicable taxes & fees. <br /> Infinity
                  Travel, is not liable in the event of a mechanical breakdown
                  during a transfer. The client assumes full financial liability
                  for any damage to the vehicle caused during the duration of
                  the transfer by them or any member of their party. The driver
                  has the right to terminate a transfer without refund, if there
                  is blatant indiscretion on the part of the client. Infinity
                  Travel is not responsible for delays or cancellations caused
                  by unsafe road conditions such as weather, accidents etc.
                  Infinity Travel is not responsible for articles left in the
                  vehicle. Vehicles cannot be loaded beyond their seating
                  capacity. Hourly (as directed) transfers are billed in
                  15-minute increments. Overtime charges will apply
                  retroactively after the first 15 minutes of prearranged time
                  described on the confirmation sheet. Infinity Travel has a
                  strict 24-hour cancellation policy for individual reservations
                  and a 48 hour cancellation policy during the Christmas holiday
                  December 24th through January 2nd, Presidents Day Weekend, and
                  during the Sundance Film Festival. Any reservation canceled
                  within that window will be charged the full amount of the
                  reservation. Our Hourly service includes only Salt Lake, Utah,
                  Davis, Weber, Summit, and Wasatch Counties. Customers credit
                  cards will be securly saved on file to be used when the
                  booking is accepted by management.
                </p>
              </div>
            </div>
            <div className="pb-20 md:pb-0">
              <label htmlFor="checkbox" className="form-control">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={checkBox}
                  required
                  onChange={() => setCheckBox((prev) => !prev)}
                  style={{
                    color: checkBox ? "rgb(66,186,150)" : "red",
                    border: checkBox
                      ? "0.15em solid rgb(66,186,150)"
                      : "0.15em solid red",
                    background: checkBox
                      ? "rgb(66,186,150)"
                      : "rgb(252,165,165)",
                  }}
                />
                <p className="leading-5">
                  I accept the terms and authorize Infinity Travel to save this
                  card on file to be charged when booking is accepted
                </p>
              </label>

              <div className="flex flex-col md:flex-row">
                <input
                  value={firstName}
                  onChange={handleFirstNameChange}
                  type="text"
                  placeholder="Card Holder First Name"
                  height={70}
                  className={`border-2 w-full 
                  ${
                    firstName.trim().length < 1
                      ? "border-red-500"
                      : "border-input-border"
                  } 
                    p-5 
                    focus:outline-none
                    text-char-black 
                    placeholder-input-place-holder`}
                />
                <input
                  value={lastName}
                  onChange={handleLastNameChange}
                  type="text"
                  placeholder="Card Holder Last Name"
                  height={70}
                  className={`border-2 w-full 
                  ${
                    lastName.trim().length < 1
                      ? "border-red-500"
                      : "border-input-border"
                  } 
                    p-5 
                    focus:outline-none
                    text-char-black 
                    placeholder-input-place-holder`}
                />
              </div>
              <div className="flex flex-col md:flex-row">
                <input
                  type="text"
                  placeholder="Billing Address"
                  height={70}
                  value={address}
                  onChange={handleAdderssChange}
                  className={`border-2 w-full
                    ${address == "" ? "border-red-500" : "border-input-border"} 
                    p-5 
                    focus:outline-none
                    text-char-black 
                    placeholder-input-place-holder`}
                />
                <input
                  type="text"
                  placeholder="Billing Zip Code"
                  height={70}
                  required
                  minLength={5}
                  ref={zipRef}
                  maxLength={5}
                  onChange={handleSetZip}
                  className={`border-2 
                    ${zip == "" ? "border-red-500" : "border-input-border"} 
                    p-5 
                    focus:outline-none
                    text-char-black 
                    placeholder-input-place-holder`}
                />
              </div>
              <div className="py-5">
                <PaymentForm
                  locationId="LERCS0R0K3RJE"
                  applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID}
                  cardTokenizeResponseReceived={(token, buyer) => {
                    setProcessing(true);
                    // console.log(token, buyer);
                    if (token.token) {
                      bookNow(token.token, token.details?.card?.last4);
                    }
                  }}
                  // createVerificationDetails={() => {
                  //   setProcessing(true);
                  //   return {
                  //     /* collected from the buyer */
                  //     billingContact: {
                  //       addressLines: [address],
                  //       familyName: lastName,
                  //       givenName: firstName,
                  //       postalCode: zip,
                  //     },
                  //     intent: "STORE",
                  //   };
                  // }}
                >
                  <CreditCard
                    buttonProps={{
                      isLoading: disablePayButton || processing,
                      css: {
                        backgroundColor:
                          disablePayButton || processing
                            ? ""
                            : "rgb(220, 38, 38) !important",
                        color: "white",
                      },
                    }}
                  >
                    {processing ? (
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      "Book Now"
                    )}
                  </CreditCard>
                </PaymentForm>
              </div>

              <button
                disabled={processing}
                onClick={cancel}
                type="button"
                className="bg-input-place-holder py-3 w-full text-white font-semibold uppercase"
              >
                close
              </button>
            </div>
          </div>
        )}

        {bookingCompleted && (
          <Confirmation
            booking={bookingCompleted}
            roundTripBooking={roundTripBooking}
            cancel={cancel}
            roundTripError={roundTripBookingError}
            payload={payload}
          />
        )}
      </div>
    </div>
  );
};
export default BookingModal;
