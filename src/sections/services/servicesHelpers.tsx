import { serciveCardProps } from "../../Types";
import { MapIcon, MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/solid";

export const serviceCards: serciveCardProps[] = [
  {
    bgImage: "https://ik.imagekit.io/zeejaydev/card.png",
    fullDes: `You can trust Infinity Travel for your airport transportation to/from the airport 
      to/from surrounding areas, ski resorts and summer destinations. Our drivers will provide meet 
      and greet service from outside security, help you with your luggage and get you to your final destination in style.`,
    Icon: MapIcon,
    smallDes:
      "We will meet you past security, help you with your luggage and more...",
    title: "airport transfers",
  },
  {
    bgImage: "",
    fullDes: `Coming Soon ...`,
    Icon: MapPinIcon,
    smallDes: "",
    title: "events & weddings",
  },
  {
    bgImage: "",
    fullDes: "Coming Soon ...",
    Icon: BriefcaseIcon,
    smallDes: "",
    title: "business transfers",
  },
];
