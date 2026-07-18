import { describe, expect, it } from "vitest";
import { demoData } from "../data/demo-data";
import { createDemoRepository } from "../data/demo-repository";
import { validateDemoData } from "./invariants";

describe("demo domain data", () => {
  it("satisfies cross-entity and safety invariants", () => {
    expect(validateDemoData(demoData)).toEqual([]);
  });

  it("keeps expired credentials visibly distinct from verified evidence", () => {
    const repository = createDemoRepository();
    const credentials = repository.listCredentials("pro-samira-rahman");

    expect(credentials).toHaveLength(1);
    expect(credentials[0]?.status).toBe("expired");
    expect(credentials[0]?.status).not.toBe("platform_verified");
  });

  it("returns repository list copies so callers cannot mutate the seed collection", () => {
    const repository = createDemoRepository();
    const firstRead = repository.listProfessionals();
    const originalCount = firstRead.length;
    firstRead.pop();

    expect(repository.listProfessionals()).toHaveLength(originalCount);
  });
});
