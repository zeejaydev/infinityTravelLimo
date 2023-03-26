import { serciveCardProps } from "../../Types";
import { MapIcon, MapPinIcon, BriefcaseIcon } from "@heroicons/react/24/solid";

export const serviceCards: serciveCardProps[] = [
  {
    bgImage: "https://ik.imagekit.io/zeejaydev/card.png",
    fullDes:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque doloribus veritatis qui, culpa eum doloremque illum sit eligendi ad consequuntur.",
    Icon: MapIcon,
    smallDes: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non!",
    title: "airport transfers",
  },
  {
    bgImage: "",
    fullDes:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque doloribus veritatis qui, culpa eum doloremque illum sit eligendi ad consequuntur.",
    Icon: MapPinIcon,
    smallDes: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non!",
    title: "events & weddings",
  },
  {
    bgImage: "",
    fullDes:
      "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eaque doloribus veritatis qui, culpa eum doloremque illum sit eligendi ad consequuntur.",
    Icon: BriefcaseIcon,
    smallDes: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Non!",
    title: "business transfers",
  },
];
