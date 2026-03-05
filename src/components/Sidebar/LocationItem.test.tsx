import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LocationItem from "./LocationItem";
import type { MovieLocation } from "../../types";

// ─── Fixture ──────────────────────────────────────────────────────────────────

function makeLocation(overrides: Partial<MovieLocation> = {}): MovieLocation {
  return {
    description: "City Hall",
    funFact: "Used for the finale scene.",
    lat: 37.779,
    lng: -122.419,
    ...overrides,
  };
}

// ─── LocationItem ─────────────────────────────────────────────────────────────

describe("LocationItem — description", () => {
  it("renders the location description", () => {
    render(<LocationItem location={makeLocation()} />);
    expect(screen.getByText("City Hall")).toBeInTheDocument();
  });

  it("renders a different description correctly", () => {
    render(
      <LocationItem
        location={makeLocation({ description: "Golden Gate Bridge" })}
      />,
    );
    expect(screen.getByText("Golden Gate Bridge")).toBeInTheDocument();
  });

  it("renders a map pin SVG icon", () => {
    const { container } = render(<LocationItem location={makeLocation()} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("LocationItem — fun fact", () => {
  it("renders the fun fact text when present", () => {
    render(<LocationItem location={makeLocation()} />);
    expect(screen.getByText("Used for the finale scene.")).toBeInTheDocument();
  });

  it("renders two SVG icons when fun fact is present (map pin + lightbulb)", () => {
    const { container } = render(<LocationItem location={makeLocation()} />);
    expect(container.querySelectorAll("svg").length).toBe(2);
  });

  it("does not render fun fact text when funFact is null", () => {
    render(<LocationItem location={makeLocation({ funFact: null })} />);
    expect(
      screen.queryByText("Used for the finale scene."),
    ).not.toBeInTheDocument();
  });

  it("renders only one SVG icon when fun fact is null (map pin only)", () => {
    const { container } = render(
      <LocationItem location={makeLocation({ funFact: null })} />,
    );
    expect(container.querySelectorAll("svg").length).toBe(1);
  });

  it("does not render the lightbulb icon when funFact is empty string", () => {
    const { container } = render(
      <LocationItem location={makeLocation({ funFact: "" })} />,
    );
    // empty string is falsy — only the map-pin svg should render
    expect(container.querySelectorAll("svg").length).toBe(1);
  });
});

describe("LocationItem — snapshots", () => {
  it("matches snapshot with fun fact", () => {
    const { container } = render(<LocationItem location={makeLocation()} />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot without fun fact", () => {
    const { container } = render(
      <LocationItem location={makeLocation({ funFact: null })} />,
    );
    expect(container).toMatchSnapshot();
  });
});
