import { describe, it, expect } from "vitest";
import { patients, getPatientById } from "./patients";

describe("patients array", () => {
  it("has exactly 4 patients", () => {
    expect(patients).toHaveLength(4);
  });

  it("all patients have unique IDs", () => {
    const ids = patients.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has the expected patient IDs", () => {
    const ids = patients.map((p) => p.id);
    expect(ids).toEqual(["maria", "ashley", "keisha", "jennifer"]);
  });
});

describe("getPatientById", () => {
  it("returns the correct patient for a valid ID", () => {
    const maria = getPatientById("maria");
    expect(maria).toBeDefined();
    expect(maria!.name).toBe("Maria Gonzalez");
    expect(maria!.lifecycleStage).toBe("eligible");
    expect(maria!.careProgram).toBe("pregnancy");
  });

  it("returns undefined for an unknown ID", () => {
    expect(getPatientById("unknown")).toBeUndefined();
  });

  it("returns undefined for an empty string", () => {
    expect(getPatientById("")).toBeUndefined();
  });
});

describe("individual patient profiles", () => {
  it("maria is eligible with null enrollment date", () => {
    const maria = getPatientById("maria")!;
    expect(maria.enrollmentDate).toBeNull();
    expect(maria.lastInteractionDate).toBeNull();
    expect(maria.riskLevel).toBe("low");
    expect(maria.recentInteractions).toHaveLength(0);
  });

  it("keisha is at-risk with high risk and missed appointments", () => {
    const keisha = getPatientById("keisha")!;
    expect(keisha.lifecycleStage).toBe("at-risk");
    expect(keisha.riskLevel).toBe("high");
    expect(keisha.missedAppointments).toBe(2);
    expect(keisha.riskFactors.length).toBeGreaterThan(0);
  });

  it("jennifer is in midlife care program", () => {
    const jennifer = getPatientById("jennifer")!;
    expect(jennifer.careProgram).toBe("midlife");
    expect(jennifer.age).toBe(45);
  });
});
