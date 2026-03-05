import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import YearFilter from "./YearFilter";
import type { Movie } from "../../types";

function makeMovie(title: string, year: number | null): Movie {
  return {
    id: title,
    title,
    releaseYear: year,
    director: null,
    writer: null,
    actors: [],
    productionCompany: null,
    distributor: null,
    locations: [
      { description: "Somewhere", funFact: null, lat: 37.77, lng: -122.4 },
    ],
  };
}

const MOVIES: Movie[] = [
  makeMovie("Vertigo", 1958),
  makeMovie("Bullitt", 1968),
  makeMovie("The Matrix", 1999),
  makeMovie("Milk", 2008),
];

describe("YearFilter", () => {
  it("renders the Era button by default", () => {
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);
    expect(screen.getByRole("button", { name: /era/i })).toBeInTheDocument();
  });

  it("dropdown is not visible before clicking", () => {
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);
    expect(screen.queryByText("All")).not.toBeInTheDocument();
  });

  it("opens the dropdown on button click", async () => {
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    // Dropdown should now be visible with at least one decade button
    expect(screen.getByText("1950s")).toBeInTheDocument();
  });

  it("shows only decades that have movies", async () => {
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));

    // 1958 → 1950s, 1968 → 1960s, 1999 → 1990s, 2008 → 2000s
    expect(screen.getByText("1950s")).toBeInTheDocument();
    expect(screen.getByText("1960s")).toBeInTheDocument();
    expect(screen.getByText("1990s")).toBeInTheDocument();
    expect(screen.getByText("2000s")).toBeInTheDocument();
  });

  it("does NOT show decades without any movies", async () => {
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    expect(screen.queryByText("1920s")).not.toBeInTheDocument();
    expect(screen.queryByText("1930s")).not.toBeInTheDocument();
  });

  it("calls onYearFilter with correct titles when a decade is selected", async () => {
    const onYearFilter = vi.fn();
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={onYearFilter} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    await user.click(screen.getByText("1950s"));

    expect(onYearFilter).toHaveBeenCalledTimes(1);
    const [passedSet] = onYearFilter.mock.calls[0] as [Set<string>];
    expect(passedSet.has("Vertigo")).toBe(true);
    expect(passedSet.has("Bullitt")).toBe(false);
  });

  it("calls onYearFilter(null) when decade is cleared via X button", async () => {
    const onYearFilter = vi.fn();
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={onYearFilter} />);

    // Select a decade first
    await user.click(screen.getByRole("button", { name: /era/i }));
    await user.click(screen.getByText("1950s"));
    expect(onYearFilter).toHaveBeenCalledTimes(1);

    // Click the X button that appears on the trigger to clear
    const xBtn = screen
      .getByRole("button", { name: /1950s/i })
      .querySelector("svg:last-child");
    if (xBtn) await user.click(xBtn as Element);

    expect(onYearFilter).toHaveBeenLastCalledWith(null);
  });

  it("updates the button label to the selected decade", async () => {
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    await user.click(screen.getByText("1960s"));

    expect(screen.getByRole("button", { name: /1960s/i })).toBeInTheDocument();
  });

  it("closes the dropdown after selecting a decade", async () => {
    const user = userEvent.setup();
    render(<YearFilter movies={MOVIES} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    await user.click(screen.getByText("1990s"));

    expect(screen.queryByText("All")).not.toBeInTheDocument();
  });

  it("shows no decade options when all movies have null releaseYear", async () => {
    const movies = [makeMovie("Unknown Year", null)];
    const user = userEvent.setup();
    render(<YearFilter movies={movies} onYearFilter={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /era/i }));
    // No decade buttons should render since no movies have a known year
    expect(screen.queryByText(/\d{4}s/)).not.toBeInTheDocument();
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe("YearFilter snapshots", () => {
  it("matches snapshot in closed (default) state", () => {
    const { container } = render(
      <YearFilter movies={MOVIES} onYearFilter={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with dropdown open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <YearFilter movies={MOVIES} onYearFilter={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /era/i }));
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot after a decade is selected", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <YearFilter movies={MOVIES} onYearFilter={vi.fn()} />,
    );
    await user.click(screen.getByRole("button", { name: /era/i }));
    await user.click(screen.getByText("1960s"));
    expect(container).toMatchSnapshot();
  });
});
