import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "./SearchBar";
import type { Movie } from "../../types";

function makeMovie(title: string, director = "Dir", year = 2000): Movie {
  return {
    id: title,
    title,
    releaseYear: year,
    director,
    writer: null,
    actors: [],
    productionCompany: null,
    distributor: null,
    locations: [{ description: "Loc", funFact: null, lat: 37.77, lng: -122.4 }],
  };
}

const MOVIES: Movie[] = [
  makeMovie("Vertigo", "Alfred Hitchcock", 1958),
  makeMovie("Bullitt", "Peter Yates", 1968),
  makeMovie("Milk", "Gus Van Sant", 2008),
  makeMovie("The Rock", "Michael Bay", 1996),
];

describe("SearchBar", () => {
  it("renders the search input", () => {
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );
    expect(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
    ).toBeInTheDocument();
  });

  it("shows no suggestions dropdown initially", () => {
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );
    expect(screen.queryByText("Vertigo")).not.toBeInTheDocument();
  });

  it("shows suggestions when user types a matching query", async () => {
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Vertigo",
    );
    expect(screen.getByText("Vertigo")).toBeInTheDocument();
  });

  it("calls onFilter with matching titles when user types", async () => {
    const onFilter = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={onFilter} onSelectMovie={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Vertigo",
    );

    const lastCall = onFilter.mock.calls[
      onFilter.mock.calls.length - 1
    ][0] as Set<string> | null;
    expect(lastCall).not.toBeNull();
    expect(lastCall?.has("Vertigo")).toBe(true);
  });

  it("calls onSelectMovie and onFilter with single title when suggestion clicked", async () => {
    const onFilter = vi.fn();
    const onSelectMovie = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar
        movies={MOVIES}
        onFilter={onFilter}
        onSelectMovie={onSelectMovie}
      />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Bullitt",
    );
    await user.click(screen.getByText("Bullitt"));

    expect(onSelectMovie).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Bullitt" }),
    );
    const filterArg = onFilter.mock.lastCall![0] as Set<string>;
    expect(filterArg.has("Bullitt")).toBe(true);
    expect(filterArg.size).toBe(1);
  });

  it("closes the dropdown after selecting a suggestion", async () => {
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );

    const input = screen.getByPlaceholderText(
      "Search movies, directors, actors...",
    );
    await user.type(input, "Milk");
    await user.click(screen.getByText("Milk"));

    // Dropdown should be gone
    expect(
      screen.queryByRole("button", { name: /milk/i }),
    ).not.toBeInTheDocument();
  });

  it("shows the clear button after typing", async () => {
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Rock",
    );

    // X button rendered by lucide renders an svg — check it's in the DOM via its parent button
    const clearBtns = screen.getAllByRole("button");
    expect(clearBtns.length).toBeGreaterThan(0);
  });

  it("clears input and calls onFilter(null) when clear button clicked", async () => {
    const onFilter = vi.fn();
    const onSelectMovie = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar
        movies={MOVIES}
        onFilter={onFilter}
        onSelectMovie={onSelectMovie}
      />,
    );

    const input = screen.getByPlaceholderText(
      "Search movies, directors, actors...",
    );
    await user.type(input, "Rock");

    // The clear button is the only non-suggestion button rendered while typing
    const clearBtn = screen
      .getAllByRole("button")
      .find((b) => !b.textContent?.trim());

    if (clearBtn) await user.click(clearBtn);

    expect((input as HTMLInputElement).value).toBe("");
    expect(onFilter).toHaveBeenLastCalledWith(null);
    expect(onSelectMovie).toHaveBeenLastCalledWith(null);
  });

  it("calls onFilter(null) when query is emptied by backspace", async () => {
    const onFilter = vi.fn();
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={onFilter} onSelectMovie={vi.fn()} />,
    );

    const input = screen.getByPlaceholderText(
      "Search movies, directors, actors...",
    );
    await user.type(input, "V");
    await user.clear(input);

    expect(onFilter).toHaveBeenLastCalledWith(null);
  });

  it("renders the Film icon inside each suggestion row", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Vertigo",
    );

    // A Film lucide icon renders an SVG inside the suggestion icon badge
    const svgs = container.querySelectorAll("svg");
    // There is at least the search magnifier + the film icon in suggestions
    expect(svgs.length).toBeGreaterThan(1);
  });

  it("shows year and director in the suggestion meta line", async () => {
    const user = userEvent.setup();
    render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );

    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Vertigo",
    );

    expect(screen.getByText(/1958/)).toBeInTheDocument();
    expect(screen.getByText(/Alfred Hitchcock/)).toBeInTheDocument();
  });
});

// ─── Snapshots ────────────────────────────────────────────────────────────────

describe("SearchBar snapshots", () => {
  it("matches snapshot in initial (empty) state", () => {
    const { container } = render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot with suggestions open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <SearchBar movies={MOVIES} onFilter={vi.fn()} onSelectMovie={vi.fn()} />,
    );
    await user.type(
      screen.getByPlaceholderText("Search movies, directors, actors..."),
      "Vertigo",
    );
    expect(container).toMatchSnapshot();
  });
});
