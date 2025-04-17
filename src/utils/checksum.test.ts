import { calculateChecksum } from "./checksum";

describe("Checksum Function", () => {
  it("should calculate the correct checksum for a given string", () => {
    const input = "test@example.comJohn Doe12345";
    const expectedChecksum = "b2d0f6d8"; // Pre-calculated checksum for this input

    expect(calculateChecksum(input)).toBe(expectedChecksum);
  });

  it("should return different checksums for different inputs", () => {
    const checksum1 = calculateChecksum("test1@example.comJohn Doe12345");
    const checksum2 = calculateChecksum("test2@example.comJohn Doe12345");

    expect(checksum1).not.toBe(checksum2);
  });

  it("should handle empty strings correctly", () => {
    const checksum = calculateChecksum("");
    expect(checksum).toBe("12345678"); // Initial checksum value in hexadecimal
  });
});
