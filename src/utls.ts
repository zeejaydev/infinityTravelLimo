import { MutableRefObject, useEffect } from "react";

export const useClickAway = (
  ref: MutableRefObject<any>,
  callback: () => void,
  show: boolean
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current != null && !ref.current.contains(e.target)) callback();
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClick);
      return () => {
        document.removeEventListener("mousedown", handleClick);
      };
    }
  }, [show]);
};

export const generateHoursInterval = (
  startHourInMinute: number,
  endHourInMinute: number,
  interval: number
): string[] => {
  const times = [];

  for (let i = 0; startHourInMinute < 24 * 60; i++) {
    if (startHourInMinute > endHourInMinute) break;

    var hh = Math.floor(startHourInMinute / 60); // getting hours of day in 0-24 format

    var mm = startHourInMinute % 60; // getting minutes of the hour in 0-55 format
    times[i] =
      (hh % 12 == 0 ? "12" : "0" + (hh % 12)).slice(-2) +
      ":" +
      ("0" + mm).slice(-2) +
      (hh % 24 >= 12 ? " PM" : " AM");

    startHourInMinute = startHourInMinute + interval;
  }

  return times;
};
