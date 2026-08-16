import { describe, expect, it, vi } from "vitest";
import { TRPCClientError } from "@trpc/client";
import { UNAUTHED_ERR_MSG } from "@shared/const";

const startLoginMock = vi.fn();
vi.mock("./const", () => ({
  startLogin: () => startLoginMock(),
  COOKIE_NAME: "session",
  ONE_YEAR_MS: 1000,
}));

describe("unauthorized redirect guard", () => {
  it("triggers startLogin at most once during concurrent unauthorized errors", async () => {
    let isRedirectingToLogin = false;
    const redirectToLoginIfUnauthorized = (error: unknown) => {
      if (!(error instanceof TRPCClientError)) return;
      if (isRedirectingToLogin) return;
      if (error.message !== UNAUTHED_ERR_MSG) return;
      isRedirectingToLogin = true;
      startLoginMock();
    };

    const err = new TRPCClientError(UNAUTHED_ERR_MSG);
    redirectToLoginIfUnauthorized(err);
    redirectToLoginIfUnauthorized(err);
    redirectToLoginIfUnauthorized(err);

    expect(startLoginMock).toHaveBeenCalledTimes(1);
  });
});
