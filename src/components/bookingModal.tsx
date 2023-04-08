import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Booking, BookingModalProps, selectTypes } from "../Types";
import { CreditCard, PaymentForm } from "react-square-web-payments-sdk";
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

  const zipRef = useRef<HTMLInputElement>(null);

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

  const bookNow = async (token: string) => {
    console.log(payload);
    fetch(
      "https://infinity-travel-limo.zeejaydevbackend.com/api/travel-limo/startBooking",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          price: results?.price ?? "",
          token: token,
          address: address,
          zip: zip,
          firstName,
          lastName,
        }),
      }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.error) {
          setProcessing(false);
          setErrorMessage(response.error);
          setResults(null);
        } else if (response.booking) {
          setProcessing(false);
          setResults(null);
          setBookingCompleted(response.booking);
        } else {
          setProcessing(false);
          console.log(response);
        }
      })
      .catch((e) => {
        console.log(e);
      });
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
        className="bg-white h-screen w-screen rounded-lg overflow-auto md:max-h-[1020px] md:w-[920px]"
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
          <div className="flex w-full flex-col p-8 gap-8">
            <div className="">
              <h1 className="text-xl font-semibold border-b-2">
                Trip Information
              </h1>

              <table className="table-auto">
                <tbody>
                  <tr>
                    <td>Service:</td>
                    <td>{payload.bookingType}</td>
                  </tr>
                  <tr>
                    <td>Vehicle Type:</td>
                    <td>Full Size SUV</td>
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
                    <td>{results.price}</td>
                  </tr>
                </tbody>
              </table>
              <h1 className="text-xl font-semibold pt-5 border-b-2">
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
                I authorize Infinity Travel Limo to save this card on file to be
                charged when booking is accepted
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
                      bookNow(token.token);
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
          <div className="flex h-full w-full items-center flex-col justify-center p-8">
            <h1 className="text-2xl font-semibold">
              Booking Status: {bookingCompleted.status}
            </h1>
            <span className="text-2xl font-semibold">
              Confirmation Id {bookingCompleted.id}
            </span>
            <button
              onClick={cancel}
              type="button"
              className="bg-input-place-holder py-3 w-full px-10 text-white font-semibold uppercase pt-3"
            >
              close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookingModal;
