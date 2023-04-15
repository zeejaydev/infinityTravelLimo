import {
  CurrencyInputProps,
  FormatValueOptions,
  IntlConfig,
  LocaleConfig,
  Options,
  RepositionCursorProps,
} from "../Types";

export const addSeparators = (value: string, separator = ","): string => {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
};

export const escapeRegExp = (stringToGoIntoTheRegex: string): string => {
  return stringToGoIntoTheRegex.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};

export const removeSeparators = (value: string, separator = ","): string => {
  const reg = new RegExp(escapeRegExp(separator), "g");
  return value.replace(reg, "");
};

export const removeInvalidChars = (
  value: string,
  validChars: ReadonlyArray<string>
): string => {
  const chars = escapeRegExp(validChars.join(""));
  const reg = new RegExp(`[^\\d${chars}]`, "gi");
  return value.replace(reg, "");
};
export const abbrValue = (
  value: number,
  decimalSeparator = ".",
  _decimalPlaces = 10
): string => {
  if (value > 999) {
    let valueLength = ("" + value).length;
    const p = Math.pow;
    const d = p(10, _decimalPlaces);
    valueLength -= valueLength % 3;

    const abbrValue =
      Math.round((value * d) / p(10, valueLength)) / d +
      " kMGTPE"[valueLength / 3];
    return abbrValue.replace(".", decimalSeparator);
  }

  return String(value);
};

type AbbrMap = { [key: string]: number };

const abbrMap: AbbrMap = { k: 1000, m: 1000000, b: 1000000000 };

/**
 * Parse a value with abbreviation e.g 1k = 1000
 */
export const parseAbbrValue = (
  value: string,
  decimalSeparator = "."
): number | undefined => {
  const reg = new RegExp(
    `(\\d+(${escapeRegExp(decimalSeparator)}\\d*)?)([kmb])$`,
    "i"
  );
  const match = value.match(reg);

  if (match) {
    const [, digits, , abbr] = match;
    const multiplier = abbrMap[abbr.toLowerCase()];

    return Number(digits.replace(decimalSeparator, ".")) * multiplier;
  }

  return undefined;
};

export type CleanValueOptions = Pick<
  CurrencyInputProps,
  | "decimalSeparator"
  | "groupSeparator"
  | "allowDecimals"
  | "decimalsLimit"
  | "allowNegativeValue"
  | "disableAbbreviations"
  | "prefix"
  | "transformRawValue"
> & { value: string };

/**
 * Remove prefix, separators and extra decimals from value
 */
export const cleanValue = ({
  value,
  groupSeparator = ",",
  decimalSeparator = ".",
  allowDecimals = true,
  decimalsLimit = 2,
  allowNegativeValue = true,
  disableAbbreviations = false,
  prefix = "",
  transformRawValue = (rawValue) => rawValue,
}: CleanValueOptions): string => {
  const transformedValue = transformRawValue(value);

  if (transformedValue === "-") {
    return transformedValue;
  }

  const abbreviations = disableAbbreviations ? [] : ["k", "m", "b"];
  const reg = new RegExp(`((^|\\D)-\\d)|(-${escapeRegExp(prefix)})`);
  const isNegative = reg.test(transformedValue);

  // Is there a digit before the prefix? eg. 1$
  const [prefixWithValue, preValue] =
    RegExp(`(\\d+)-?${escapeRegExp(prefix)}`).exec(value) || [];
  const withoutPrefix = prefix
    ? prefixWithValue
      ? transformedValue.replace(prefixWithValue, "").concat(preValue)
      : transformedValue.replace(prefix, "")
    : transformedValue;
  const withoutSeparators = removeSeparators(withoutPrefix, groupSeparator);
  const withoutInvalidChars = removeInvalidChars(withoutSeparators, [
    groupSeparator,
    decimalSeparator,
    ...abbreviations,
  ]);

  let valueOnly = withoutInvalidChars;

  if (!disableAbbreviations) {
    // disallow letter without number
    if (
      abbreviations.some(
        (letter) => letter === withoutInvalidChars.toLowerCase()
      )
    ) {
      return "";
    }
    const parsed = parseAbbrValue(withoutInvalidChars, decimalSeparator);
    if (parsed) {
      valueOnly = String(parsed);
    }
  }

  const includeNegative = isNegative && allowNegativeValue ? "-" : "";

  if (decimalSeparator && valueOnly.includes(decimalSeparator)) {
    const [int, decimals] = withoutInvalidChars.split(decimalSeparator);
    const trimmedDecimals =
      decimalsLimit && decimals ? decimals.slice(0, decimalsLimit) : decimals;
    const includeDecimals = allowDecimals
      ? `${decimalSeparator}${trimmedDecimals}`
      : "";

    return `${includeNegative}${int}${includeDecimals}`;
  }

  return `${includeNegative}${valueOnly}`;
};

export const fixedDecimalValue = (
  value: string,
  decimalSeparator: string,
  fixedDecimalLength?: number
): string => {
  if (fixedDecimalLength && value.length > 1) {
    if (value.includes(decimalSeparator)) {
      const [int, decimals] = value.split(decimalSeparator);
      if (decimals.length > fixedDecimalLength) {
        return `${int}${decimalSeparator}${decimals.slice(
          0,
          fixedDecimalLength
        )}`;
      }
    }

    const reg =
      value.length > fixedDecimalLength
        ? new RegExp(`(\\d+)(\\d{${fixedDecimalLength}})`)
        : new RegExp(`(\\d)(\\d+)`);

    const match = value.match(reg);
    if (match) {
      const [, int, decimals] = match;
      return `${int}${decimalSeparator}${decimals}`;
    }
  }

  return value;
};

export const getSuffix = (
  value: string,
  { groupSeparator = ",", decimalSeparator = "." }: Options
): string | undefined => {
  const suffixReg = new RegExp(
    `\\d([^${escapeRegExp(groupSeparator)}${escapeRegExp(
      decimalSeparator
    )}0-9]+)`
  );
  const suffixMatch = value.match(suffixReg);
  return suffixMatch ? suffixMatch[1] : undefined;
};

/**
 * Format value with decimal separator, group separator and prefix
 */
export const formatValue = (options: FormatValueOptions): string => {
  const {
    value: _value,
    decimalSeparator,
    intlConfig,
    decimalScale,
    prefix = "",
    suffix = "",
  } = options;

  if (_value === "" || _value === undefined) {
    return "";
  }

  if (_value === "-") {
    return "-";
  }

  const isNegative = new RegExp(
    `^\\d?-${prefix ? `${escapeRegExp(prefix)}?` : ""}\\d`
  ).test(_value);

  const value =
    decimalSeparator !== "."
      ? replaceDecimalSeparator(_value, decimalSeparator, isNegative)
      : _value;

  const defaultNumberFormatOptions = {
    minimumFractionDigits: decimalScale || 0,
    maximumFractionDigits: 20,
  };

  const numberFormatter = intlConfig
    ? new Intl.NumberFormat(
        intlConfig.locale,
        intlConfig.currency
          ? {
              ...defaultNumberFormatOptions,
              style: "currency",
              currency: intlConfig.currency,
            }
          : defaultNumberFormatOptions
      )
    : new Intl.NumberFormat(undefined, defaultNumberFormatOptions);

  const parts = numberFormatter.formatToParts(Number(value));

  let formatted = replaceParts(parts, options);

  // Does intl formatting add a suffix?
  const intlSuffix = getSuffix(formatted, { ...options });

  // Include decimal separator if user input ends with decimal separator
  const includeDecimalSeparator =
    _value.slice(-1) === decimalSeparator ? decimalSeparator : "";

  const [, decimals] = value.match(RegExp("\\d+\\.(\\d+)")) || [];

  // Keep original decimal padding if no decimalScale
  if (decimalScale === undefined && decimals && decimalSeparator) {
    if (formatted.includes(decimalSeparator)) {
      formatted = formatted.replace(
        RegExp(`(\\d+)(${escapeRegExp(decimalSeparator)})(\\d+)`, "g"),
        `$1$2${decimals}`
      );
    } else {
      if (intlSuffix && !suffix) {
        formatted = formatted.replace(
          intlSuffix,
          `${decimalSeparator}${decimals}${intlSuffix}`
        );
      } else {
        formatted = `${formatted}${decimalSeparator}${decimals}`;
      }
    }
  }

  if (suffix && includeDecimalSeparator) {
    return `${formatted}${includeDecimalSeparator}${suffix}`;
  }

  if (intlSuffix && includeDecimalSeparator) {
    return formatted.replace(
      intlSuffix,
      `${includeDecimalSeparator}${intlSuffix}`
    );
  }

  if (intlSuffix && suffix) {
    return formatted.replace(intlSuffix, `${includeDecimalSeparator}${suffix}`);
  }

  return [formatted, includeDecimalSeparator, suffix].join("");
};

/**
 * Before converting to Number, decimal separator has to be .
 */
const replaceDecimalSeparator = (
  value: string,
  decimalSeparator: FormatValueOptions["decimalSeparator"],
  isNegative: boolean
): string => {
  let newValue = value;
  if (decimalSeparator && decimalSeparator !== ".") {
    newValue = newValue.replace(
      RegExp(escapeRegExp(decimalSeparator), "g"),
      "."
    );
    if (isNegative && decimalSeparator === "-") {
      newValue = `-${newValue.slice(1)}`;
    }
  }
  return newValue;
};

const replaceParts = (
  parts: Intl.NumberFormatPart[],
  {
    prefix,
    groupSeparator,
    decimalSeparator,
    decimalScale,
    disableGroupSeparators = false,
  }: Pick<
    FormatValueOptions,
    | "prefix"
    | "groupSeparator"
    | "decimalSeparator"
    | "decimalScale"
    | "disableGroupSeparators"
  >
): string => {
  return parts
    .reduce(
      (prev, { type, value }, i) => {
        if (i === 0 && prefix) {
          if (type === "minusSign") {
            return [value, prefix];
          }

          if (type === "currency") {
            return [...prev, prefix];
          }

          return [prefix, value];
        }

        if (type === "currency") {
          return prefix ? prev : [...prev, value];
        }

        if (type === "group") {
          return !disableGroupSeparators
            ? [...prev, groupSeparator !== undefined ? groupSeparator : value]
            : prev;
        }

        if (type === "decimal") {
          if (decimalScale !== undefined && decimalScale === 0) {
            return prev;
          }

          return [
            ...prev,
            decimalSeparator !== undefined ? decimalSeparator : value,
          ];
        }

        if (type === "fraction") {
          return [
            ...prev,
            decimalScale !== undefined ? value.slice(0, decimalScale) : value,
          ];
        }

        return [...prev, value];
      },
      [""]
    )
    .join("");
};

const defaultConfig: LocaleConfig = {
  currencySymbol: "",
  groupSeparator: "",
  decimalSeparator: "",
  prefix: "",
  suffix: "",
};

/**
 * Get locale config from input or default
 */
export const getLocaleConfig = (intlConfig?: IntlConfig): LocaleConfig => {
  const { locale, currency } = intlConfig || {};
  const numberFormatter = locale
    ? new Intl.NumberFormat(
        locale,
        currency ? { currency, style: "currency" } : undefined
      )
    : new Intl.NumberFormat();

  return numberFormatter
    .formatToParts(1000.1)
    .reduce((prev, curr, i): LocaleConfig => {
      if (curr.type === "currency") {
        if (i === 0) {
          return { ...prev, currencySymbol: curr.value, prefix: curr.value };
        } else {
          return { ...prev, currencySymbol: curr.value, suffix: curr.value };
        }
      }
      if (curr.type === "group") {
        return { ...prev, groupSeparator: curr.value };
      }
      if (curr.type === "decimal") {
        return { ...prev, decimalSeparator: curr.value };
      }

      return prev;
    }, defaultConfig);
};

export const isNumber = (input: string): boolean =>
  RegExp(/\d/, "gi").test(input);

export const padTrimValue = (
  value: string,
  decimalSeparator = ".",
  decimalScale?: number
): string => {
  if (decimalScale === undefined || value === "" || value === undefined) {
    return value;
  }

  if (!value.match(/\d/g)) {
    return "";
  }

  const [int, decimals] = value.split(decimalSeparator);

  if (decimalScale === 0) {
    return int;
  }

  let newValue = decimals || "";

  if (newValue.length < decimalScale) {
    while (newValue.length < decimalScale) {
      newValue += "0";
    }
  } else {
    newValue = newValue.slice(0, decimalScale);
  }

  return `${int}${decimalSeparator}${newValue}`;
};

export const repositionCursor = ({
  selectionStart,
  value,
  lastKeyStroke,
  stateValue,
  groupSeparator,
}: RepositionCursorProps): {
  modifiedValue: string;
  cursorPosition: number | null | undefined;
} => {
  let cursorPosition = selectionStart;
  let modifiedValue = value;
  if (stateValue && cursorPosition) {
    const splitValue = value.split("");
    // if cursor is to right of groupSeparator and backspace pressed, delete the character to the left of the separator and reposition the cursor
    if (
      lastKeyStroke === "Backspace" &&
      stateValue[cursorPosition] === groupSeparator
    ) {
      splitValue.splice(cursorPosition - 1, 1);
      cursorPosition -= 1;
    }
    // if cursor is to left of groupSeparator and delete pressed, delete the character to the right of the separator and reposition the cursor
    if (
      lastKeyStroke === "Delete" &&
      stateValue[cursorPosition] === groupSeparator
    ) {
      splitValue.splice(cursorPosition, 1);
      cursorPosition += 1;
    }
    modifiedValue = splitValue.join("");
    return { modifiedValue, cursorPosition };
  }

  return { modifiedValue, cursorPosition: selectionStart };
};
