import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import CompareProfessionalsPage from "./[id]/compare/page";

describe("CompareProfessionalsPage", () => {
  it("lets coordinators select eligible professionals without enabling near matches", async () => {
    render(await CompareProfessionalsPage({
      params: Promise.resolve({ id: "request-doctor-evening" }),
      searchParams: Promise.resolve({ professionals: "pro-dr-ayesha-karim,pro-dr-imran-kabir" }),
    }));

    expect(screen.getByRole("heading", { name: "Choose how to continue." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Select and continue" })).toHaveAttribute(
      "href",
      "/professionals/pro-dr-ayesha-karim?request=request-doctor-evening",
    );
    expect(screen.getByRole("link", { name: "Propose adjusted terms" })).toHaveAttribute(
      "href",
      "/requests/request-doctor-evening/adjustments/new?professional=pro-dr-imran-kabir",
    );
    expect(screen.queryByRole("link", { name: /invite/i })).not.toBeInTheDocument();
  });
});
