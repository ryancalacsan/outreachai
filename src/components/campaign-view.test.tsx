import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CampaignView } from "./campaign-view";

describe("CampaignView", () => {
  it("renders all 4 patient names", () => {
    const { container } = render(<CampaignView onSelectPatient={vi.fn()} />);
    expect(container.textContent).toContain("Maria Gonzalez");
    expect(container.textContent).toContain("Ashley Williams");
    expect(container.textContent).toContain("Keisha Johnson");
    expect(container.textContent).toContain("Jennifer Park");
  });

  it("renders stat card labels", () => {
    const { container } = render(<CampaignView onSelectPatient={vi.fn()} />);
    expect(container.textContent).toContain("Total Patients");
    expect(container.textContent).toContain("Needs Enrollment");
    expect(container.textContent).toContain("At Risk");
    expect(container.textContent).toContain("Engaged");
  });

  it("shows lifecycle action labels", () => {
    const { container } = render(<CampaignView onSelectPatient={vi.fn()} />);
    expect(container.textContent).toContain("Initial enrollment outreach");
    expect(container.textContent).toContain("Schedule first appointment");
    expect(container.textContent).toContain("Urgent re-engagement needed");
  });

  it("calls onSelectPatient when a patient card is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const { container } = render(<CampaignView onSelectPatient={onSelect} />);

    // Find the button that contains Maria's name (resilient to DOM order changes)
    const allButtons = Array.from(container.querySelectorAll("button"));
    const mariaButton = allButtons.find((btn) =>
      btn.textContent?.includes("Maria Gonzalez")
    )!;
    await user.click(mariaButton);

    expect(onSelect).toHaveBeenCalledOnce();
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "maria", name: "Maria Gonzalez" })
    );
  });

  it("shows risk factors preview", () => {
    const { container } = render(<CampaignView onSelectPatient={vi.fn()} />);
    expect(container.textContent).toContain("First pregnancy");
  });

  it("renders the page heading", () => {
    const { container } = render(<CampaignView onSelectPatient={vi.fn()} />);
    expect(container.textContent).toContain("Patient Outreach");
  });
});
