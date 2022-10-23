import Decimal from "decimal.js-light";

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-GB", {
    notation: "compact",
  }).format(n);

const SHORTEN_COUNT_MAX_DISPLAY = 5;

/**
 * Format like in shortAddress
 * Rules/Limits:
 * - rounded down explicitly
 * - denominate by k, m, b, ... for now
 */
export const shortenCount = (count: Decimal | undefined): string => {
  if (!count) return "";

  const isPositive = count.greaterThanOrEqualTo(0);
  const roundingMethod = isPositive ? Decimal.ROUND_FLOOR : Decimal.ROUND_CEIL;
  const absoluteCount = count.absoluteValue();

  if (absoluteCount.lessThan(0.01)) return isPositive ? "0" : "-0";

  if (absoluteCount.lessThan(10))
    return count.toDecimalPlaces(2, roundingMethod).toString();

  if (absoluteCount.lessThan(100))
    return count.toDecimalPlaces(1, roundingMethod).toString();

  if (absoluteCount.lessThan(1000))
    return count.toDecimalPlaces(0, roundingMethod).toString();

  const power = absoluteCount
    .log()
    .dividedBy(3)
    .toDecimalPlaces(0, Decimal.ROUND_FLOOR);

  let powerFloor = power;
  let suffix;
  let overMaxSupportedRange = false;
  switch (true) {
    case power.lessThanOrEqualTo(1):
      suffix = "k";
      break;
    case power.lessThanOrEqualTo(2):
      suffix = "m";
      break;
    case power.lessThanOrEqualTo(3):
      suffix = "b";
      break;
    case power.lessThanOrEqualTo(4):
      suffix = "t";
      break;
    case power.lessThanOrEqualTo(5):
      suffix = "q";
      break;
    default:
      suffix = "q";
      powerFloor = new Decimal(5);
      overMaxSupportedRange = true;
      break;
  }

  const magnitude = count.div(new Decimal(1e3).pow(powerFloor));

  if (overMaxSupportedRange) {
    return `${magnitude
      .toDecimalPlaces(0, roundingMethod)
      .toString()}${suffix}`;
  }

  let value = magnitude
    .toDecimalPlaces(1, roundingMethod)
    .toString()
    .substring(0, SHORTEN_COUNT_MAX_DISPLAY - 1);
  if (value.lastIndexOf(".") === value.length - 1) {
    value = value.substring(0, value.length - 1);
  }

  return `${value}${suffix}`;
};
