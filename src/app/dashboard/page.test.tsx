import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import DashboardPage from "./page";

describe("DashboardPage", () => {
  it("shows all five staffing journeys and the human decision boundary", () => {
    render(<DashboardPage />);

    expect(screen.getByRole("heading", { name: "Coverage at a glance." })).toBeInTheDocument();
    for (const role of ["Doctor", "Registered nurse", "Lab technologist", "Physiotherapist", "Caregiver"]) {
      expect(screen.getByRole("heading", { name: role })).toBeInTheDocument();
    }
    expect(screen.getByText(/A person approves every invitation/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /Review matches/i })).toHaveLength(5);
  });
});
