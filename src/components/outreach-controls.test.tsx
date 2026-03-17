import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OutreachControls } from "./outreach-controls";
import { getPatientById } from "@/lib/data/patients";

function defaultProps() {
  return {
    onGenerate: vi.fn(),
    isGenerating: false,
    disabled: false,
  };
}

describe("OutreachControls", () => {
  it("renders section labels", () => {
    const { container } = render(<OutreachControls {...defaultProps()} />);
    expect(container.textContent).toContain("Outreach Configuration");
    expect(container.textContent).toContain("Outreach Goal");
    expect(container.textContent).toContain("Message Tone");
    expect(container.textContent).toContain("Channels");
    expect(container.textContent).toContain("AI Model");
  });

  it("renders channel toggle buttons with aria-pressed", () => {
    const { container } = render(<OutreachControls {...defaultProps()} />);
    const buttons = Array.from(container.querySelectorAll("button[aria-pressed]"));
    const labels = buttons.map((b) => b.textContent);
    expect(labels).toContain("SMS");
    expect(labels).toContain("Email");
    expect(labels).toContain("In-App");
  });

  it("renders generate button", () => {
    const { container } = render(<OutreachControls {...defaultProps()} />);
    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate Messages")
    );
    expect(genBtn).toBeTruthy();
  });

  it("disables generate button when disabled prop is true", () => {
    const { container } = render(
      <OutreachControls {...defaultProps()} disabled />
    );
    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate")
    )!;
    expect(genBtn.disabled).toBe(true);
  });

  it("shows 'Generating...' when isGenerating is true", () => {
    const { container } = render(
      <OutreachControls {...defaultProps()} isGenerating />
    );
    expect(container.textContent).toContain("Generating...");
  });

  it("channel toggle buttons reflect default state", () => {
    const { container } = render(<OutreachControls {...defaultProps()} />);
    const smsBtn = Array.from(
      container.querySelectorAll("button[aria-pressed]")
    ).find((b) => b.textContent === "SMS")!;
    // Without a patient, default channels are sms and email
    expect(smsBtn.getAttribute("aria-pressed")).toBe("true");
  });

  it("does not show access code input in mock mode by default", () => {
    const { container } = render(<OutreachControls {...defaultProps()} />);
    expect(container.querySelector("input[type='password']")).toBeNull();
  });

  it("calls onGenerate with correct payload on button click", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    const { container } = render(
      <OutreachControls {...defaultProps()} onGenerate={onGenerate} />
    );

    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate Messages")
    )!;
    await user.click(genBtn);

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        tone: "warm-supportive",
        provider: "mock",
        channels: expect.arrayContaining(["sms"]),
      })
    );
  });

  it("can toggle channels off", async () => {
    const user = userEvent.setup();
    const { container } = render(<OutreachControls {...defaultProps()} />);
    const emailBtn = Array.from(
      container.querySelectorAll("button[aria-pressed]")
    ).find((b) => b.textContent === "Email")!;
    await user.click(emailBtn);
    expect(emailBtn.getAttribute("aria-pressed")).toBe("false");
  });

  it("disables generate button when no channels selected", async () => {
    const user = userEvent.setup();
    const { container } = render(<OutreachControls {...defaultProps()} />);
    const channelBtns = Array.from(
      container.querySelectorAll("button[aria-pressed='true']")
    );
    // Toggle all active channels off
    for (const btn of channelBtns) {
      await user.click(btn);
    }
    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate")
    ) as HTMLButtonElement;
    expect(genBtn.disabled).toBe(true);
  });
});

describe("OutreachControls with patient", () => {
  it("defaults channel to patient preferred channel", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    const maria = getPatientById("maria")!;
    const { container } = render(
      <OutreachControls {...defaultProps()} onGenerate={onGenerate} patient={maria} />
    );

    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate Messages")
    )!;
    await user.click(genBtn);

    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        channels: ["sms"],
      })
    );
  });

  it("sets goal based on patient lifecycle stage", async () => {
    const user = userEvent.setup();
    const onGenerate = vi.fn();
    const maria = getPatientById("maria")!;
    const { container } = render(
      <OutreachControls {...defaultProps()} onGenerate={onGenerate} patient={maria} />
    );

    const genBtn = Array.from(container.querySelectorAll("button")).find(
      (b) => b.textContent?.includes("Generate Messages")
    )!;
    await user.click(genBtn);

    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        goal: "enrollment",
      })
    );
  });
});
