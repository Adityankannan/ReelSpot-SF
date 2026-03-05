import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingScreen from "./LoadingScreen";

describe("LoadingScreen", () => {
  it("renders the app title in loading state", () => {
    render(<LoadingScreen />);
    expect(screen.getByText("ReelSpot SF")).toBeInTheDocument();
  });

  it("renders the loading subtitle", () => {
    render(<LoadingScreen />);
    expect(screen.getByText("Loading filming locations…")).toBeInTheDocument();
  });

  it("renders the SVG icon", () => {
    const { container } = render(<LoadingScreen />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("shows error title when error prop is provided", () => {
    render(<LoadingScreen error="Network failure" />);
    expect(screen.getByText("Failed to load data")).toBeInTheDocument();
  });

  it("shows the error message text", () => {
    render(<LoadingScreen error="Network failure" />);
    expect(screen.getByText("Network failure")).toBeInTheDocument();
  });

  it("does NOT show app title when in error state", () => {
    render(<LoadingScreen error="oops" />);
    expect(screen.queryByText("ReelSpot SF")).not.toBeInTheDocument();
  });

  it("does NOT show loading subtitle when in error state", () => {
    render(<LoadingScreen error="oops" />);
    expect(
      screen.queryByText("Loading filming locations…"),
    ).not.toBeInTheDocument();
  });

  it("does NOT show error UI when error is null", () => {
    render(<LoadingScreen error={null} />);
    expect(screen.queryByText("Failed to load data")).not.toBeInTheDocument();
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe("LoadingScreen snapshots", () => {
  it("matches snapshot in loading state", () => {
    const { container } = render(<LoadingScreen />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot in error state", () => {
    const { container } = render(<LoadingScreen error="Network failure" />);
    expect(container).toMatchSnapshot();
  });
});
