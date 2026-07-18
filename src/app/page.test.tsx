import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import HomePage from "./page";

describe("HomePage", () => {
  it("states the product promise and human decision boundary", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Turn an urgent staffing need into a trusted shortlist.",
    );
    expect(screen.getByText(/A person makes the final staffing decision/i)).toBeInTheDocument();
    expect(screen.getByText(/fictional data only/i)).toBeInTheDocument();
    expect(screen.getByText(/no account, payment, or real data required/i)).toBeInTheDocument();
  });
});
