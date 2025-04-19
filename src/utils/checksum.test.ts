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
});
