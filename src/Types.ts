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
  hourly = "Hourly",
  pointToPoint = "Point-To-Point",
  // roundTrip = "Round Trip",
}

export type formPayload = {
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
