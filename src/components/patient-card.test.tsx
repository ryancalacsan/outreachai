import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PatientCard } from "./patient-card";
import { getPatientById } from "@/lib/data/patients";

const maria = getPatientById("maria")!;
const keisha = getPatientById("keisha")!;

describe("PatientCard compact mode", () => {
  it("renders patient name", () => {
    const { container } = render(<PatientCard patient={maria} compact />);
    expect(container.textContent).toContain("Maria Gonzalez");
  });

  it("renders lifecycle stage badge", () => {
    const { container } = render(<PatientCard patient={maria} compact />);
    expect(container.textContent).toContain("Eligible");
  });

  it("renders care program label", () => {
    const { container } = render(<PatientCard patient={maria} compact />);
    expect(container.textContent).toContain("Pregnancy");
  });

  it("fires onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <PatientCard patient={maria} compact onClick={onClick} />
    );
    const button = container.querySelector("button")!;
    await user.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("applies selected styling when selected", () => {
    const { container } = render(
      <PatientCard patient={maria} compact selected />
    );
    const button = container.querySelector("button")!;
    expect(button.className).toContain("border-teal");
  });
});

describe("PatientCard full mode", () => {
  it("renders patient name", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    expect(container.textContent).toContain("Keisha Johnson");
  });

  it("renders lifecycle and risk badges", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    const badges = container.querySelectorAll("[data-slot='badge']");
    const badgeTexts = Array.from(badges).map((b) => b.textContent);
    expect(badgeTexts).toContain("At Risk");
    expect(badgeTexts).toContain("High Risk");
  });

  it("renders risk factors", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    expect(container.textContent).toContain(
      "Gestational diabetes (diagnosed week 24)"
    );
    expect(container.textContent).toContain("BMI > 30");
  });

  it("renders care team names", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    expect(container.textContent).toContain("Patricia Hawkins");
    expect(container.textContent).toContain("Dr. Rebecca Martinez");
  });

  it("shows 'Not enrolled' for null enrollment date", () => {
    const { container } = render(<PatientCard patient={maria} />);
    expect(container.textContent).toContain("Not enrolled");
  });

  it("shows 'No prior contact' for null last interaction date", () => {
    const { container } = render(<PatientCard patient={maria} />);
    expect(container.textContent).toContain("No prior contact");
  });

  it("renders clinical notes", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    expect(container.textContent).toContain(
      "Was actively engaged for 3 months"
    );
  });

  it("renders recent interaction types", () => {
    const { container } = render(<PatientCard patient={keisha} />);
    expect(container.textContent).toContain("Virtual visit");
    expect(container.textContent).toContain("Missed check-in");
  });
});
