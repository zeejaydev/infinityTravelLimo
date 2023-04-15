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
  setResults: (resultsReset: StartBookingResults | null) => void;
  // submit: () => void;
  setErrorMessage: (errorReset: string | null) => void;
  payload: FormPayload;
};

export type StartBookingResults = {
  distance: string;
  duration: string;
  price: number;
  cars: number;
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

export enum ModalType {
  textModal = "text",
  emailCaptuer = "email",
}

export type ModalProps = {
  title: string;
  description: string;
  modalType: ModalType;
  setCloseModal: (close: boolean) => void;
  isModalOpen: boolean;
};

export type CouponResp = {
  percentage: number;
  active: boolean;
  error: string | null;
};

export type BookingResponse = {
  booking: {
    booking: Booking;
  };
  roundTripBooking: {
    booking: Booking;
    roundTripError?: string;
  } | null;
  error?: string;
};

export type ConfirmationProps = {
  cancel: () => void;
  payload: FormPayload;
  booking: Booking;
  roundTripError: string;
  roundTripBooking: Booking | null;
  error?: string;
};

import React, { ElementType } from "react";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

/**
 * Value in different formats
 *
 * @experimental
 */
export type CurrencyInputOnChangeValues = {
  /**
   * Value as float or null if empty
   *
   * Example:
   *   "1.99" > 1.99
   *   "" > null
   */
  float: number | null;

  /**
   * Value after applying formatting
   *
   * Example: "1000000" > "1,000,0000"
   */
  formatted: string;

  /**
   * Non formatted value as string
   */
  value: string;
};

export type IntlConfig = {
  locale: string;
  currency?: string;
};

export type CurrencyInputProps = Overwrite<
  React.ComponentPropsWithRef<"input">,
  {
    /**
     * Allow decimals
     *
     * Default = true
     */
    allowDecimals?: boolean;

    /**
     * Allow user to enter negative value
     *
     * Default = true
     */
    allowNegativeValue?: boolean;

    /**
     * Component id
     */
    id?: string;

    /**
     *  Maximum characters the user can enter
     */
    maxLength?: number;

    /**
     * Class names
     */
    className?: string;

    /**
     * Custom component
     *
     * Default = <input/>
     */
    customInput?: ElementType;

    /**
     * Limit length of decimals allowed
     *
     * Default = 2
     */
    decimalsLimit?: number;

    /**
     * Specify decimal scale for padding/trimming
     *
     * Example:
     *   1.5 -> 1.50
     *   1.234 -> 1.23
     */
    decimalScale?: number;

    /**
     * Default value if not passing in value via props
     */
    defaultValue?: number | string;

    /**
     * Disabled
     *
     * Default = false
     */
    disabled?: boolean;

    /**
     * Value will always have the specified length of decimals
     *
     * Example:
     *   123 -> 1.23
     *
     * Note: This formatting only happens onBlur
     */
    fixedDecimalLength?: number;

    /**
     * Handle change in value
     */
    onValueChange?: (
      value: string | undefined,
      name?: string,
      values?: CurrencyInputOnChangeValues
    ) => void;

    /**
     * Placeholder if there is no value
     */
    placeholder?: string;

    /**
     * Include a prefix eg. £
     */
    prefix?: string;

    /**
     * Include a suffix eg. €
     */
    suffix?: string;

    /**
     * Incremental value change on arrow down and arrow up key press
     */
    step?: number;

    /**
     * Separator between integer part and fractional part of value.
     *
     * This cannot be a number
     */
    decimalSeparator?: string;

    /**
     * Separator between thousand, million and billion
     *
     * This cannot be a number
     */
    groupSeparator?: string;

    /**
     * Disable auto adding separator between values eg. 1000 -> 1,000
     *
     * Default = false
     */
    disableGroupSeparators?: boolean;

    /**
     * Disable abbreviations (m, k, b)
     *
     * Default = false
     */
    disableAbbreviations?: boolean;

    /**
     * International locale config, examples:
     *   { locale: 'ja-JP', currency: 'JPY' }
     *   { locale: 'en-IN', currency: 'INR' }
     *
     * Any prefix, groupSeparator or decimalSeparator options passed in
     * will override Intl Locale config
     */
    intlConfig?: IntlConfig;

    /**
     * Transform the raw value form the input before parsing
     */
    transformRawValue?: (rawValue: string) => string;
  }
>;

export type FormatValueOptions = {
  /**
   * Value to format
   */
  value: string | undefined;

  /**
   * Decimal separator
   *
   * Default = '.'
   */
  decimalSeparator?: string;

  /**
   * Group separator
   *
   * Default = ','
   */
  groupSeparator?: string;

  /**
   * Turn off separators
   *
   * This will override Group separators
   *
   * Default = false
   */
  disableGroupSeparators?: boolean;

  /**
   * Intl locale currency config
   */
  intlConfig?: IntlConfig;

  /**
   * Specify decimal scale for padding/trimming
   *
   * Eg. 1.5 -> 1.50 or 1.234 -> 1.23
   */
  decimalScale?: number;

  /**
   * Prefix
   */
  prefix?: string;

  /**
   * Suffix
   */
  suffix?: string;
};

export type Options = {
  decimalSeparator?: string;
  groupSeparator?: string;
};

export type LocaleConfig = {
  currencySymbol: string;
  groupSeparator: string;
  decimalSeparator: string;
  prefix: string;
  suffix: string;
};

export type RepositionCursorProps = {
  selectionStart?: number | null;
  value: string;
  lastKeyStroke: string | null;
  stateValue?: string;
  groupSeparator?: string;
};
