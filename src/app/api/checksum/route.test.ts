import { NextRequest } from "next/server";
import { POST } from "./route";
import { calculateChecksum } from "../../../utils/checksum";

jest.mock("../../../utils/checksum", () => ({
  calculateChecksum: jest.fn(),
}));

function createMockRequest(body: any): NextRequest {
  const req = new Request("http://localhost:3000/api/checksum", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return new NextRequest(req);
}

describe("POST /api/checksum", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if any required parameters are missing", async () => {
    const req = createMockRequest({ nm: "John", em: "john@example.com", ref: "123" }); // missing cs
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Missing required parameters." });
  });

  it("should return 400 if checksum does not match", async () => {
    (calculateChecksum as jest.Mock).mockReturnValue("wrong-checksum");

    const req = createMockRequest({
      nm: "John Doe",
      em: "john@example.com",
      ref: "abc123",
      cs: "expected-checksum",
    });

    const res = await POST(req);
    expect(calculateChecksum).toHaveBeenCalledWith("john@example.comJohnDoeabc123");
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: "Checksum mismatch." });
  });

  it("should return 200 if checksum is valid", async () => {
    (calculateChecksum as jest.Mock).mockReturnValue("expected-checksum");

    const req = createMockRequest({
      nm: "John Doe",
      em: "john@example.com",
      ref: "abc123",
      cs: "expected-checksum",
    });

    const res = await POST(req);
    expect(calculateChecksum).toHaveBeenCalledWith("john@example.comJohnDoeabc123");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Checksum validated successfully." });
  });

  it("should return 500 if an exception is thrown", async () => {
    (calculateChecksum as jest.Mock).mockImplementation(() => {
      throw new Error("Unexpected error");
    });

    const req = createMockRequest({
      nm: "John Doe",
      em: "john@example.com",
      ref: "abc123",
      cs: "expected-checksum",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: "Error validating checksum." });
  });
});
