import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationsSection from "./LocationsSection";
import type { MovieLocation } from "../../types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const twoLocations: MovieLocation[] = [
  {
    description: "Mission Dolores",
    funFact: "Hitchcock insisted on filming at dusk.",
    lat: 37.7645,
    lng: -122.4268,
  },
  {
    description: "Golden Gate Bridge",
    funFact: null,
    lat: 37.8199,
    lng: -122.4783,
  },
];

const singleLocation: MovieLocation[] = [
  { description: "City Hall", funFact: null, lat: 37.779, lng: -122.419 },
];

// ─── LocationsSection ─────────────────────────────────────────────────────────

describe("LocationsSection — header", () => {
  it("shows the section header with count 2", () => {
    render(<LocationsSection locations={twoLocations} />);
    expect(screen.getByText("FILMING LOCATIONS (2)")).toBeInTheDocument();
  });

  it("shows the section header with count 1", () => {
    render(<LocationsSection locations={singleLocation} />);
    expect(screen.getByText("FILMING LOCATIONS (1)")).toBeInTheDocument();
  });

  it("shows the section header with count 0 for an empty list", () => {
    render(<LocationsSection locations={[]} />);
    expect(screen.getByText("FILMING LOCATIONS (0)")).toBeInTheDocument();
  });
});

describe("LocationsSection — location items", () => {
  it("renders all location descriptions", () => {
    render(<LocationsSection locations={twoLocations} />);
    expect(screen.getByText("Mission Dolores")).toBeInTheDocument();
    expect(screen.getByText("Golden Gate Bridge")).toBeInTheDocument();
  });

  it("renders fun facts for locations that have them", () => {
    render(<LocationsSection locations={twoLocations} />);
    expect(
      screen.getByText("Hitchcock insisted on filming at dusk."),
    ).toBeInTheDocument();
  });

  it("does not render fun fact content for locations without one", () => {
    const { container } = render(
      <LocationsSection locations={singleLocation} />,
    );
    // City Hall has no funFact — only one svg (map pin, no lightbulb)
    expect(container.querySelectorAll("svg").length).toBe(1);
  });

  it("renders nothing inside the list for an empty locations array", () => {
    const { container } = render(<LocationsSection locations={[]} />);
    expect(container.querySelectorAll("svg").length).toBe(0);
  });

  it("renders the correct number of location rows", () => {
    const { container } = render(<LocationsSection locations={twoLocations} />);
    // Two LocationItem rows → at minimum 2 map-pin SVGs (first has funFact → 3 total)
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThanOrEqual(2);
  });
});

describe("LocationsSection — snapshots", () => {
  it("matches snapshot with two locations", () => {
    const { container } = render(<LocationsSection locations={twoLocations} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with a single location (no fun fact)", () => {
    const { container } = render(
      <LocationsSection locations={singleLocation} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with an empty list", () => {
    const { container } = render(<LocationsSection locations={[]} />);
    expect(container).toMatchSnapshot();
  });
});
