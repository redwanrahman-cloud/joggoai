import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MatchResultsPage from "./[id]/matches/page";

describe("MatchResultsPage", () => {
  it("puts comparison and near-match context at the top of the decision flow", async () => {
    render(await MatchResultsPage({ params: Promise.resolve({ id: "request-icu-night" }) }));

    expect(screen.getByRole("heading", { level: 1, name: "1 recommended match" })).toBeInTheDocument();
    expect(screen.getByText(/2 safe near matches are ready/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Compare top professionals" })).toHaveAttribute(
      "href",
      expect.stringContaining("/requests/request-icu-night/compare"),
    );
    expect(screen.getByRole("heading", { name: "Near matches worth comparing" })).toBeInTheDocument();
  });
});
