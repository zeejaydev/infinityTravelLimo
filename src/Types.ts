export type Input = {
  name: string;
  type: string;
  placeHolder: string;
  maxLength?: number;
  minLength?: number;
  height: number;
  min?: string;
};

export enum selectTypes {
  fromAirport = "From Airport",
  toAirport = "To Airport",
  pointToPoint = "Point-To-Point",
  hourly = "Hourly",
  // roundTrip = "Round Trip",
}

export type FormPayload = {
  fname: string;
  phone: string;
  nop: string;
  date: string;
  time: string;
  comments: string;
  returnDate: string;
  returnTime: string;
  roundTrip: string;
  hours: string;
  bookingType: string;
  dest: string;
  endDest: string;
  email: string;
  flightNumber: string;
};

export type serciveCardProps = {
  bgImage: string;
  Icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  title: string;
  smallDes: string;
  fullDes: string;
};

export type CarCardProps = {
  imageSrc: string;
  price: string;
  title: string;
  smallDes: string;
};

export type ErrorResponseDataMessage = {
  error: string;
};

export type BookingModalProps = {
  setShowBookingModal: (showModal: boolean) => void;
  loading: boolean;
  results: StartBookingResults | null;
  errorMessage: string | null;
  setResults: (resultsReset: null) => void;
  // submit: () => void;
  setErrorMessage: (errorReset: null) => void;
  payload: FormPayload;
};

export type StartBookingResults = {
  distance: string;
  duration: string;
  price: string;
};

export enum Locations {
  airport = "Salt Lake City International Airport (SLC), West Terminal Drive, Salt Lake City, UT, USA",
}

export type Booking = {
  created_at: string;
  customer_id: string;
  customer_note: string;
  id: string;
  location_id: string;
  start_at: string;
  status: string;
  updated_at: string;
  version: number;
  appointment_segments: any[];
};
