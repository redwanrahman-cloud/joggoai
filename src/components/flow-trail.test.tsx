import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlowTrail } from "./flow-trail";

describe("FlowTrail", () => {
  it("shows the current step and preserves links to completed steps", () => {
    render(
      <FlowTrail
        current={2}
        label="Clinic coordinator journey"
        steps={[
          { label: "Request", href: "/requests/new" },
          { label: "Shortlist" },
          { label: "Compare", href: "/compare" },
        ]}
      />,
    );

    expect(screen.getByRole("navigation", { name: "Clinic coordinator journey" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Request/ })).toHaveAttribute("href", "/requests/new");
    expect(screen.getByText("Shortlist").closest("li")).toHaveClass("current");
    expect(screen.getByText("Shortlist").closest("li")).toHaveAttribute("aria-current", "step");
  });
});
