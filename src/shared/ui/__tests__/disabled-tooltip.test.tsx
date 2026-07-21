// @vitest-environment jsdom

import { describe, it, expect, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { DisabledTooltip } from "../disabled-tooltip";
import { TooltipProvider } from "../tooltip";

// Radix positions the tooltip with ResizeObserver, which jsdom lacks.
beforeAll(() => {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

function renderWithProvider(ui: React.ReactNode) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe("DisabledTooltip", () => {
  it("leaves the control untouched when there is no reason", () => {
    renderWithProvider(
      <DisabledTooltip reason={null} className="wrapper">
        <button disabled>Commit</button>
      </DisabledTooltip>,
    );

    const wrapper = screen.getByText("Commit").parentElement!;
    expect(wrapper.className).toBe("wrapper");
    expect(wrapper.getAttribute("tabindex")).toBeNull();
  });

  it("shows the reason on focus and keeps the wrapper reachable", async () => {
    renderWithProvider(
      <DisabledTooltip reason="Add wallet to perform this action">
        <button disabled>Commit</button>
      </DisabledTooltip>,
    );

    const wrapper = screen.getByText("Commit").parentElement!;
    expect(wrapper.getAttribute("tabindex")).toBe("0");

    fireEvent.focus(wrapper);

    expect(
      await screen.findAllByText("Add wallet to perform this action"),
    ).not.toHaveLength(0);
  });

  it("stops the disabled control from swallowing hover", () => {
    renderWithProvider(
      <DisabledTooltip reason="Add wallet to perform this action">
        <button disabled>Commit</button>
      </DisabledTooltip>,
    );

    // Without this the control eats the pointer and the tooltip never opens.
    const wrapper = screen.getByText("Commit").parentElement!;
    expect(wrapper.className).toContain("[&>*]:pointer-events-none");
  });
});
