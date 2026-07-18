import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Loading from "./loading";
import NotFound from "./not-found";

describe("global route states", () => {
  it("offers a deterministic recovery path for missing demo records", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("fictional record");
    expect(screen.getByRole("link", { name: "Restart the demo" })).toHaveAttribute("href", "/requests/new");
  });

  it("announces loading without implying that a decision was made", () => {
    render(<Loading />);

    const state = screen.getByRole("main");
    expect(state).toHaveAttribute("aria-live", "polite");
    expect(state).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText(/Loading the fictional demo workflow/i)).toBeInTheDocument();
  });
});
