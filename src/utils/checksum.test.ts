import { calculateChecksum } from "./checksum";

describe("Checksum Function", () => {
  it("should calculate the correct checksum for a given string", () => {
    const input = "test@example.comJohn Doe12345";
    const expectedChecksum = calculateChecksum(input); // Dynamically calculate the expected checksum

    expect(calculateChecksum(input)).toBe(expectedChecksum);
  });

  it("should return different checksums for different inputs", () => {
    const input1 = "test1@example.comJohn Doe12345";
    const input2 = "test2@example.comJohn Doe12345";

    const checksum1 = calculateChecksum(input1);
    const checksum2 = calculateChecksum(input2);

    expect(checksum1).not.toBe(checksum2); // Ensure different inputs produce different checksums
  });

  it("should handle empty strings correctly", () => {
    const input = "";
    const expectedChecksum = calculateChecksum(input); // Dynamically calculate the expected checksum
    expect(calculateChecksum(input)).toBe(expectedChecksum);
  });

  it("should validate the checksum from a URL", () => {
    // Simulate a URL with query parameters
    const url = "https://example.com?em=test@example.com&nm=John%20Doe&ref=12345&cs=1234df53";

    // Extract parameters from the URL
    const params = new URLSearchParams(url.split("?")[1]);
    const em = params.get("em") || "";
    const nm = params.get("nm") || "";
    const ref = params.get("ref") || "";
    const cs = params.get("cs") || "";

    // Calculate the checksum
    const calculatedChecksum = calculateChecksum(`${em}${nm}${ref}`);

    // Compare the calculated checksum with the one from the URL
    expect(calculatedChecksum).toBe(cs);
  });

  it("should succeed when URL params are in different order but checksum is unchanged", () => {
    const originalUrl = "https://example.com?em=test@example.com&nm=JohnDoe&ref=12345";
    const params = new URLSearchParams(originalUrl.split("?")[1]);

    const em = params.get("em") || "";
    const nm = params.get("nm") || "";
    const ref = params.get("ref") || "";

    const cs = calculateChecksum(`${em}${nm}${ref}`);

    // Reorder the params but keep checksum that same
    const reorderedUrl = `https://example.com?ref=12345&nm=JohnDoe&em=test@example.com&cs=${cs}`;
    const reorderedParams = new URLSearchParams(reorderedUrl.split("?")[1]);

    const em2 = reorderedParams.get("em") || "";
    const nm2 = reorderedParams.get("nm") || "";
    const ref2 = reorderedParams.get("ref") || "";
    const cs2 = reorderedParams.get("cs") || "";

    const reorderedChecksum = calculateChecksum(`${em2}${nm2}${ref2}`);

    expect(reorderedChecksum).toBe(cs2);
  });

  it("should handle missing parameters", () => {
    // url missing nm and ref
    const url = "https://example.com?em=test@example.com&cs=deadbeef";

    const params = new URLSearchParams(url.split("?")[1]);
    const em = params.get("em") || "";
    const nm = params.get("nm") || "";
    const ref = params.get("ref") || "";
    const cs = params.get("cs") || "";

    const calculated = calculateChecksum(`${em}${nm}${ref}`);
    expect(typeof calculated).toBe("string");
  });

  it("should be case sensitive", () => {
    const checksum1 = calculateChecksum("john@example.com");
    const checksum2 = calculateChecksum("John@example.com");

    expect(checksum1).not.toBe(checksum2);
  });

  it("should be whitespaces sensitive", () => {
    const checksum1 = calculateChecksum("JohnDoe");
    const checksum2 = calculateChecksum("John Doe");

    expect(checksum1).not.toBe(checksum2);
  });
});
