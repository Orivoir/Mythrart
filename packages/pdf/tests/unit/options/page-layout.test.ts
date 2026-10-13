import { describe, expect, it } from "vitest";
import { getPageLayoutOptions } from "../../../src/options/page-layout";

describe("getPageLayoutOptions", () => {
  describe("readable", () => {
    it("should use US Letter format with 1-inch margins", () => {
      expect(getPageLayoutOptions("readable")).toEqual({
        preferCssPageSize: "false",
        printBackground: "true",
        paperWidth: "8.5",
        paperHeight: "11",
        marginTop: "1",
        marginBottom: "1",
        marginLeft: "1",
        marginRight: "1",
      });
    });
  });

  describe("ready-to-print", () => {
    it("should delegate page sizing and margins to CSS", () => {
      expect(getPageLayoutOptions("ready-to-print")).toEqual({
        preferCssPageSize: "true",
        printBackground: "true",
        marginTop: "0",
        marginBottom: "0",
        marginLeft: "0",
        marginRight: "0",
      });
    });
  });
});
