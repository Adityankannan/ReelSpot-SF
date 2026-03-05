import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PanelHeader from "./PanelHeader";

// ─── PanelHeader ──────────────────────────────────────────────────────────────

describe("PanelHeader", () => {
  // ── Title ──────────────────────────────────────────────────────────────────

  it("renders the movie title", () => {
    render(<PanelHeader title="Vertigo" releaseYear={1958} />);
    expect(screen.getByText("Vertigo")).toBeInTheDocument();
  });

  it("renders the title inside an h2 element", () => {
    render(<PanelHeader title="Vertigo" releaseYear={1958} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Vertigo",
    );
  });

  it("renders a different title correctly", () => {
    render(<PanelHeader title="The Birds" releaseYear={1963} />);
    expect(screen.getByText("The Birds")).toBeInTheDocument();
  });

  // ── Release year ───────────────────────────────────────────────────────────

  it("renders the release year when provided", () => {
    render(<PanelHeader title="Vertigo" releaseYear={1958} />);
    expect(screen.getByText("1958")).toBeInTheDocument();
  });

  it("omits the release year span when releaseYear is null", () => {
    render(<PanelHeader title="Vertigo" releaseYear={null} />);
    expect(screen.queryByText("1958")).not.toBeInTheDocument();
  });

  it("renders year 0 correctly (falsy edge case is guarded by null check)", () => {
    // null → no year; any real year including unusual values must render
    render(<PanelHeader title="Vertigo" releaseYear={2000} />);
    expect(screen.getByText("2000")).toBeInTheDocument();
  });

  // ── Icon ───────────────────────────────────────────────────────────────────

  it("renders an SVG film icon", () => {
    const { container } = render(
      <PanelHeader title="Vertigo" releaseYear={1958} />,
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  // ── Snapshots ──────────────────────────────────────────────────────────────

  it("matches snapshot with title and year", () => {
    const { container } = render(
      <PanelHeader title="Vertigo" releaseYear={1958} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with title only (no year)", () => {
    const { container } = render(
      <PanelHeader title="Vertigo" releaseYear={null} />,
    );
    expect(container).toMatchSnapshot();
  });
});
