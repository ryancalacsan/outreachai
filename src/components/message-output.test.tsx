import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageOutput } from "./message-output";
import type { GenerateResponse } from "@/lib/types";

const mockResponse: GenerateResponse = {
  provider: "mock",
  generatedAt: "2026-03-16T00:00:00Z",
  channelMessages: [
    {
      channel: "sms",
      variants: [
        {
          id: "sms-a",
          approach: "Empathy-led",
          content: "Test SMS message",
          engagementLikelihood: "high",
          reasoning: "This is the reasoning for SMS variant A",
        },
        {
          id: "sms-b",
          approach: "Value-focused",
          content: "Another SMS message",
          engagementLikelihood: "medium",
          reasoning: "This is the reasoning for SMS variant B",
        },
      ],
    },
    {
      channel: "email",
      variants: [
        {
          id: "email-a",
          approach: "Education-led",
          subject: "Welcome to your care plan",
          content: "Test email message body",
          engagementLikelihood: "high",
          reasoning: "Email reasoning here",
        },
      ],
    },
  ],
};

describe("MessageOutput", () => {
  it("renders channel tabs", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    const tabs = container.querySelectorAll("[role='tab']");
    expect(tabs.length).toBe(2);
  });

  it("renders variant content for active tab", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    expect(container.textContent).toContain("Empathy-led");
    expect(container.textContent).toContain("Value-focused");
    expect(container.textContent).toContain("Test SMS message");
    expect(container.textContent).toContain("Another SMS message");
  });

  it("renders engagement likelihood indicators", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    expect(container.textContent).toContain("high");
    expect(container.textContent).toContain("medium");
  });

  it("shows provider label", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    expect(container.textContent).toContain("Demo Mode");
  });

  it("renders reasoning toggle that expands", async () => {
    const user = userEvent.setup();
    const { container } = render(<MessageOutput response={mockResponse} />);

    // Find "Why this works" buttons
    const toggleButtons = Array.from(container.querySelectorAll("button")).filter(
      (btn) => btn.textContent?.includes("Why this works")
    );
    expect(toggleButtons.length).toBeGreaterThan(0);

    // Initially reasoning is hidden
    expect(container.textContent).not.toContain(
      "This is the reasoning for SMS variant A"
    );

    // Click to expand first variant's reasoning
    await user.click(toggleButtons[0]);
    expect(container.textContent).toContain(
      "This is the reasoning for SMS variant A"
    );
  });

  it("shows email subject line when Email tab is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<MessageOutput response={mockResponse} />);

    // Click on Email tab
    const tabs = container.querySelectorAll("[role='tab']");
    const emailTab = Array.from(tabs).find((t) =>
      t.textContent?.includes("Email")
    )!;
    await user.click(emailTab);
    expect(container.textContent).toContain("Welcome to your care plan");
  });

  it("has copy buttons for variants", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    const buttons = container.querySelectorAll("button");
    // Should have toggle buttons + copy buttons + tab triggers
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it("renders Generated Messages heading", () => {
    const { container } = render(<MessageOutput response={mockResponse} />);
    expect(container.textContent).toContain("Generated Messages");
  });
});
