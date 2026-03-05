import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode, HTMLAttributes } from "react";
import MovieDetailPanel from "./MovieDetailPanel";
import type { Movie } from "../../types";

// Mock Framer Motion so snapshots are stable and animations don't interfere
vi.mock("framer-motion", () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeMovie(overrides: Partial<Movie> = {}): Movie {
  return {
    id: "vertigo",
    title: "Vertigo",
    releaseYear: 1958,
    director: "Alfred Hitchcock",
    writer: "Alec Coppel",
    actors: ["James Stewart", "Kim Novak"],
    productionCompany: "Paramount Pictures",
    distributor: "Paramount",
    locations: [
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
    ],
    ...overrides,
  };
}

// ─── MovieDetailPanel — behaviour ────────────────────────────────────────────

describe("MovieDetailPanel", () => {
  it("renders nothing when movie is null", () => {
    const { container } = render(
      <MovieDetailPanel movie={null} onClose={vi.fn()} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders the movie title", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("Vertigo")).toBeInTheDocument();
  });

  it("renders the release year", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("1958")).toBeInTheDocument();
  });

  it("renders the director", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("Alfred Hitchcock")).toBeInTheDocument();
  });

  it("renders all actors joined by comma", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("James Stewart, Kim Novak")).toBeInTheDocument();
  });

  it("renders production company", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("Paramount Pictures")).toBeInTheDocument();
  });

  it("renders all filming locations", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("Mission Dolores")).toBeInTheDocument();
    expect(screen.getByText("Golden Gate Bridge")).toBeInTheDocument();
  });

  it("renders fun facts when present", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(
      screen.getByText("Hitchcock insisted on filming at dusk."),
    ).toBeInTheDocument();
  });

  it("does NOT render fun fact text when funFact is null", () => {
    const movie = makeMovie({
      locations: [
        { description: "Somewhere", funFact: null, lat: 37.77, lng: -122.4 },
      ],
    });
    render(<MovieDetailPanel movie={movie} onClose={vi.fn()} />);
    expect(screen.getByText("Somewhere")).toBeInTheDocument();
    expect(
      screen.queryByText("Hitchcock insisted on filming at dusk."),
    ).not.toBeInTheDocument();
  });

  it("shows location count in section header", () => {
    render(<MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />);
    expect(screen.getByText("FILMING LOCATIONS (2)")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<MovieDetailPanel movie={makeMovie()} onClose={onClose} />);

    const closeBtn = screen.getByRole("button");
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("omits director section when director is null", () => {
    const movie = makeMovie({ director: null });
    render(<MovieDetailPanel movie={movie} onClose={vi.fn()} />);
    expect(screen.queryByText("DIRECTOR")).not.toBeInTheDocument();
  });

  it("omits cast section when actors array is empty", () => {
    const movie = makeMovie({ actors: [] });
    render(<MovieDetailPanel movie={movie} onClose={vi.fn()} />);
    expect(screen.queryByText("CAST")).not.toBeInTheDocument();
  });

  it("omits production section when productionCompany is null", () => {
    const movie = makeMovie({ productionCompany: null });
    render(<MovieDetailPanel movie={movie} onClose={vi.fn()} />);
    expect(screen.queryByText("PRODUCTION")).not.toBeInTheDocument();
  });

  it("omits release year when releaseYear is null", () => {
    const movie = makeMovie({ releaseYear: null });
    render(<MovieDetailPanel movie={movie} onClose={vi.fn()} />);
    expect(screen.queryByText("1958")).not.toBeInTheDocument();
  });
});

// ─── MovieDetailPanel — snapshots ────────────────────────────────────────────

describe("MovieDetailPanel snapshots", () => {
  it("matches snapshot with full movie data", () => {
    const { container } = render(
      <MovieDetailPanel movie={makeMovie()} onClose={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with minimal movie data (no optional fields)", () => {
    const movie = makeMovie({
      director: null,
      writer: null,
      actors: [],
      productionCompany: null,
      distributor: null,
      releaseYear: null,
      locations: [
        { description: "City Hall", funFact: null, lat: 37.78, lng: -122.42 },
      ],
    });
    const { container } = render(
      <MovieDetailPanel movie={movie} onClose={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot when movie is null (empty render)", () => {
    const { container } = render(
      <MovieDetailPanel movie={null} onClose={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });
});
