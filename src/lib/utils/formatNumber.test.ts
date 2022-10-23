import Decimal from "decimal.js-light";
import { shortenCount } from "./formatNumber";

describe("formatNumber", () => {
  describe("shortenCount", () => {
    it("should return values correctly", () => {
      expect(shortenCount(undefined)).toBe("");

      expect(shortenCount(new Decimal(0))).toBe("0");

      expect(shortenCount(new Decimal(0.001))).toBe("0");
      expect(shortenCount(new Decimal(0.009))).toBe("0");
      expect(shortenCount(new Decimal(0.015))).toBe("0.01");
      expect(shortenCount(new Decimal(0.245))).toBe("0.24");
      expect(shortenCount(new Decimal(1))).toBe("1");
      expect(shortenCount(new Decimal(23.456))).toBe("23.4");
      expect(shortenCount(new Decimal(456.7))).toBe("456");
      expect(shortenCount(new Decimal(999.9999999999999))).toBe("999");
      expect(shortenCount(new Decimal(1000))).toBe("1k");
      expect(shortenCount(new Decimal(1.124e3))).toBe("1.1k");
      expect(shortenCount(new Decimal(67.321e3))).toBe("67.3k");
      expect(shortenCount(new Decimal(234.567e3))).toBe("234k");
      expect(shortenCount(new Decimal(1.124e6))).toBe("1.1m");
      expect(shortenCount(new Decimal(67.321e6))).toBe("67.3m");
      expect(shortenCount(new Decimal(234.567e6))).toBe("234m");
      expect(shortenCount(new Decimal(1.124e9))).toBe("1.1b");
      expect(shortenCount(new Decimal(67.321e9))).toBe("67.3b");
      expect(shortenCount(new Decimal(234.567e9))).toBe("234b");
      expect(shortenCount(new Decimal(1.124e12))).toBe("1.1t");
      expect(shortenCount(new Decimal(67.321e12))).toBe("67.3t");
      expect(shortenCount(new Decimal(234.567e12))).toBe("234t");
      expect(shortenCount(new Decimal(1.124e15))).toBe("1.1q");
      expect(shortenCount(new Decimal(67.321e15))).toBe("67.3q");
      expect(shortenCount(new Decimal(234.567e15))).toBe("234q");
      expect(shortenCount(new Decimal(234.567e18))).toBe("234567q");

      expect(shortenCount(new Decimal(-0.001))).toBe("-0");
      expect(shortenCount(new Decimal(-0.009))).toBe("-0");
      expect(shortenCount(new Decimal(-0.015))).toBe("-0.01");
      expect(shortenCount(new Decimal(-0.245))).toBe("-0.24");
      expect(shortenCount(new Decimal(-1))).toBe("-1");
      expect(shortenCount(new Decimal(-23.456))).toBe("-23.4");
      expect(shortenCount(new Decimal(-456.7))).toBe("-456");
      expect(shortenCount(new Decimal(-999.9999999999999))).toBe("-999");
      expect(shortenCount(new Decimal(-1000))).toBe("-1k");
      expect(shortenCount(new Decimal(-1.124e3))).toBe("-1.1k");
      expect(shortenCount(new Decimal(-67.321e3))).toBe("-67k");
      expect(shortenCount(new Decimal(-234.567e3))).toBe("-234k");
      expect(shortenCount(new Decimal(-1.124e6))).toBe("-1.1m");
      expect(shortenCount(new Decimal(-67.321e6))).toBe("-67m");
      expect(shortenCount(new Decimal(-234.567e6))).toBe("-234m");
      expect(shortenCount(new Decimal(-1.124e9))).toBe("-1.1b");
      expect(shortenCount(new Decimal(-67.321e9))).toBe("-67b");
      expect(shortenCount(new Decimal(-234.567e9))).toBe("-234b");
      expect(shortenCount(new Decimal(-1.124e12))).toBe("-1.1t");
      expect(shortenCount(new Decimal(-67.321e12))).toBe("-67t");
      expect(shortenCount(new Decimal(-234.567e12))).toBe("-234t");
      expect(shortenCount(new Decimal(-1.124e15))).toBe("-1.1q");
      expect(shortenCount(new Decimal(-67.321e15))).toBe("-67q");
      expect(shortenCount(new Decimal(-234.567e15))).toBe("-234q");
      expect(shortenCount(new Decimal(-234.567e18))).toBe("-234567q");
    });
  });
});
