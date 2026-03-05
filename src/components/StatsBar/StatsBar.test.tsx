import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsBar from "./StatsBar";

describe("StatsBar", () => {
  it("displays the totalMovies count", () => {
    render(<StatsBar totalMovies={42} totalMarkers={100} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("displays the totalMarkers count", () => {
    render(<StatsBar totalMovies={42} totalMarkers={185} />);
    expect(screen.getByText("185")).toBeInTheDocument();
  });

  it("renders the 'movies' label", () => {
    render(<StatsBar totalMovies={10} totalMarkers={20} />);
    expect(screen.getByText("movies")).toBeInTheDocument();
  });

  it("renders the 'locations mapped' label", () => {
    render(<StatsBar totalMovies={10} totalMarkers={20} />);
    expect(screen.getByText("locations mapped")).toBeInTheDocument();
  });

  it("updates when props change", () => {
    const { rerender } = render(<StatsBar totalMovies={1} totalMarkers={5} />);
    expect(screen.getByText("1")).toBeInTheDocument();

    rerender(<StatsBar totalMovies={99} totalMarkers={5} />);
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("renders zero counts without errors", () => {
    render(<StatsBar totalMovies={0} totalMarkers={0} />);
    const zeros = screen.getAllByText("0");
    expect(zeros).toHaveLength(2);
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe("StatsBar snapshots", () => {
  it("matches snapshot with typical counts", () => {
    const { container } = render(
      <StatsBar totalMovies={42} totalMarkers={185} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with zero counts", () => {
    const { container } = render(<StatsBar totalMovies={0} totalMarkers={0} />);
    expect(container).toMatchSnapshot();
  });
});
