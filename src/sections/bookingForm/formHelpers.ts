import { Input, selectTypes } from "../../Types";

export const bookingFormMenuTypes: selectTypes[] = [
  selectTypes.fromAirport,
  selectTypes.toAirport,
  selectTypes.pointToPoint,
  selectTypes.hourly,
  // selectTypes.roundTrip,
];

export const formPayloadMap = {
  // map names has to match the input obj name prop
  ["fname"]: "",
  ["phone"]: "",
  ["nop"]: "",
  ["date"]: "",
  ["time"]: "",
  ["comments"]: "",
  ["returnTime"]: "",
  ["returnDate"]: "",
  ["roundTrip"]: "none",
  ["hours"]: "3",
  ["bookingType"]: selectTypes.fromAirport,
  ["dest"]: "",
  ["endDest"]: "",
  ["email"]: "",
  ["flightNumber"]: "",
};

const today = new Date();
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 2);
let returnDate = new Date();
returnDate.setDate(tomorrow.getDate() + 1);
export const inputs: Input[] = [
  {
    name: "fname",
    placeHolder: "Full Name",
    type: "text",
    height: 70,
  },
  {
    name: "phone",
    placeHolder: "Phone Number",
    type: "tel",
    maxLength: 14,
    minLength: 14,
    height: 70,
  },
  {
    name: "email",
    placeHolder: "Email",
    type: "email",
    height: 70,
  },
  {
    name: "nop",
    placeHolder: "Number of Passengers",
    type: "number",
    height: 70,
    min: "0",
  },
  {
    name: "date",
    placeHolder: "Date",
    type: "date",
    height: 70,
    min: tomorrow.toISOString().split("T")[0],
  },
  {
    name: "returnDate",
    placeHolder: "Return",
    type: "date",
    height: 70,
    min: returnDate.toISOString().split("T")[0],
  },
  {
    name: "time",
    placeHolder: "Time",
    type: "time",
    height: 70,
    min: new Date().toLocaleTimeString(),
  },
  {
    name: "dest",
    placeHolder: "Start Destination",
    type: "text",
    height: 70,
  },
  {
    name: "endDest",
    placeHolder: "End Destination",
    type: "text",
    height: 70,
  },
  {
    name: "flightNumber",
    placeHolder: "Flight Info ",
    type: "text",
    height: 70,
  },
  {
    name: "roundTrip",
    placeHolder: "",
    type: "select",
    height: 70,
  },
  {
    name: "returnTime",
    placeHolder: "Return Time",
    type: "time",
    height: 70,
  },
  {
    name: "hours",
    placeHolder: "Hours min 3",
    type: "number",
    height: 70,
    min: "3",
  },
];
