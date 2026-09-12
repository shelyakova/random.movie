import { describe, it, expect } from "vitest";
import { registerSchema } from "./auth.schema";

describe("registerSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = registerSchema.safeParse({
      username: "test",
      password: "123456",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });
});
