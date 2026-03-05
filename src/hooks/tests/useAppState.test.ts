import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAppState } from "../useAppState";
import * as useMovieDataModule from "../useMovieData";
import type { Movie, MapMarker } from "../../types";

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
        funFact: null,
        lat: 37.7645,
        lng: -122.4268,
      },
    ],
    ...overrides,
  };
}

function makeMarker(overrides: Partial<MapMarker> = {}): MapMarker {
  return {
    id: "Vertigo__Mission Dolores",
    movieTitle: "Vertigo",
    releaseYear: 1958,
    description: "Mission Dolores",
    funFact: null,
    lat: 37.7645,
    lng: -122.4268,
    ...overrides,
  };
}

const MOVIES = [
  makeMovie({ id: "vertigo", title: "Vertigo" }),
  makeMovie({ id: "bullitt", title: "Bullitt", releaseYear: 1968 }),
];

const MARKERS = [
  makeMarker({ id: "Vertigo__Mission Dolores", movieTitle: "Vertigo" }),
  makeMarker({
    id: "Bullitt__Russian Hill",
    movieTitle: "Bullitt",
    description: "Russian Hill",
  }),
];

// ─── Setup ────────────────────────────────────────────────────────────────────

function mockMovieData(
  overrides: Partial<ReturnType<typeof useMovieDataModule.useMovieData>> = {},
) {
  vi.spyOn(useMovieDataModule, "useMovieData").mockReturnValue({
    movies: MOVIES,
    markers: MARKERS,
    loading: false,
    error: null,
    search: vi.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  mockMovieData();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Initial state ────────────────────────────────────────────────────────────

describe("useAppState — initial state", () => {
  it("exposes movies and markers from useMovieData", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.movies).toEqual(MOVIES);
    expect(result.current.markers).toEqual(MARKERS);
  });

  it("starts with no selected movie or marker", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.selectedMovie).toBeNull();
    expect(result.current.selectedMarkerId).toBeNull();
  });

  it("starts with null activeFilter (all pins visible)", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.activeFilter).toBeNull();
  });

  it("starts with filterResetKey and searchResetKey at 0", () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.filterResetKey).toBe(0);
    expect(result.current.searchResetKey).toBe(0);
  });
});

// ─── activeFilter derivation ──────────────────────────────────────────────────

describe("useAppState — activeFilter", () => {
  it("equals searchFilter when only searchFilter is set", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
    });
    expect(result.current.activeFilter).toEqual(new Set(["Vertigo"]));
  });

  it("equals yearFilter when only yearFilter is set", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleYearFilter(new Set(["Vertigo", "Bullitt"]));
    });
    expect(result.current.activeFilter).toEqual(
      new Set(["Vertigo", "Bullitt"]),
    );
  });

  it("returns intersection when both filters are set", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo", "Bullitt"]));
    });
    act(() => {
      result.current.handleYearFilter(new Set(["Bullitt"]));
    });
    expect(result.current.activeFilter).toEqual(new Set(["Bullitt"]));
  });

  it("returns empty set when intersection is empty", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
    });
    act(() => {
      result.current.handleYearFilter(new Set(["Bullitt"]));
    });
    expect(result.current.activeFilter).toEqual(new Set());
  });

  it("returns null when both filters are cleared", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
    });
    act(() => {
      result.current.handleSearchFilter(null);
    });
    expect(result.current.activeFilter).toBeNull();
  });
});

// ─── handleSearchFilter ───────────────────────────────────────────────────────

describe("useAppState — handleSearchFilter", () => {
  it("sets searchFilter", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
    });
    expect(result.current.activeFilter).toEqual(new Set(["Vertigo"]));
  });

  it("clears selectedMovie when called with null", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    expect(result.current.selectedMovie).not.toBeNull();

    act(() => {
      result.current.handleSearchFilter(null);
    });
    expect(result.current.selectedMovie).toBeNull();
  });

  it("does NOT clear selectedMovie when called with a non-null set", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleSearchFilter(new Set(["Bullitt"]));
    });
    expect(result.current.selectedMovie).not.toBeNull();
  });
});

// ─── handleYearFilter ─────────────────────────────────────────────────────────

describe("useAppState — handleYearFilter", () => {
  it("sets the year filter", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleYearFilter(new Set(["Vertigo"]));
    });
    expect(result.current.activeFilter).toEqual(new Set(["Vertigo"]));
  });

  it("clears selectedMovie when year filter cleared and no search filter", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleYearFilter(null);
    });
    expect(result.current.selectedMovie).toBeNull();
  });

  it("does NOT clear selectedMovie when year filter cleared but search filter is still active", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
    });
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleYearFilter(null);
    });
    expect(result.current.selectedMovie).not.toBeNull();
  });
});

// ─── handleMarkerClick ────────────────────────────────────────────────────────

describe("useAppState — handleMarkerClick", () => {
  it("sets selectedMovie to the movie matching the marker", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleMarkerClick(MARKERS[0]);
    });
    expect(result.current.selectedMovie?.title).toBe("Vertigo");
  });

  it("sets selectedMarkerId to the clicked marker id", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleMarkerClick(MARKERS[1]);
    });
    expect(result.current.selectedMarkerId).toBe("Bullitt__Russian Hill");
  });

  it("sets selectedMovie to null if no movie matches the marker", () => {
    const { result } = renderHook(() => useAppState());
    const orphanMarker = makeMarker({ movieTitle: "Unknown Film" });
    act(() => {
      result.current.handleMarkerClick(orphanMarker);
    });
    expect(result.current.selectedMovie).toBeNull();
  });
});

// ─── handleSelectMovie ────────────────────────────────────────────────────────

describe("useAppState — handleSelectMovie", () => {
  it("sets selectedMovie and picks the first matching marker id", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[1]);
    });
    expect(result.current.selectedMovie?.title).toBe("Bullitt");
    expect(result.current.selectedMarkerId).toBe("Bullitt__Russian Hill");
  });

  it("clears both selectedMovie and selectedMarkerId when called with null", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleSelectMovie(null);
    });
    expect(result.current.selectedMovie).toBeNull();
    expect(result.current.selectedMarkerId).toBeNull();
  });
});

// ─── handleRandomMovie ───────────────────────────────────────────────────────

describe("useAppState — handleRandomMovie", () => {
  it("picks a movie and sets it as selectedMovie", () => {
    vi.spyOn(Math, "random").mockReturnValue(0); // always picks index 0
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleRandomMovie();
    });
    expect(result.current.selectedMovie?.title).toBe("Vertigo");
  });

  it("sets searchFilter to only the picked movie's title", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleRandomMovie();
    });
    expect(result.current.activeFilter).toEqual(new Set(["Vertigo"]));
  });

  it("increments filterResetKey (to remount YearFilter)", () => {
    const { result } = renderHook(() => useAppState());
    const before = result.current.filterResetKey;
    act(() => {
      result.current.handleRandomMovie();
    });
    expect(result.current.filterResetKey).toBe(before + 1);
  });

  it("clears any active year filter", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleYearFilter(new Set(["Vertigo"]));
    });
    // both filters active → intersection
    act(() => {
      result.current.handleRandomMovie();
    });
    // after random, yearFilter is null → activeFilter is just the search set
    expect(result.current.activeFilter).toEqual(
      new Set([result.current.selectedMovie!.title]),
    );
  });

  it("does nothing when movies list is empty", () => {
    mockMovieData({ movies: [], markers: [] });
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleRandomMovie();
    });
    expect(result.current.selectedMovie).toBeNull();
    expect(result.current.activeFilter).toBeNull();
  });
});

// ─── handleClosePanel ─────────────────────────────────────────────────────────

describe("useAppState — handleClosePanel", () => {
  it("clears selectedMovie and selectedMarkerId", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleClosePanel();
    });
    expect(result.current.selectedMovie).toBeNull();
    expect(result.current.selectedMarkerId).toBeNull();
  });

  it("does NOT clear searchFilter when panel was NOT opened via Random", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSearchFilter(new Set(["Vertigo"]));
      result.current.handleSelectMovie(MOVIES[0]);
    });
    act(() => {
      result.current.handleClosePanel();
    });
    // search filter should remain so the user's search results stay visible
    expect(result.current.activeFilter).toEqual(new Set(["Vertigo"]));
  });

  it("clears searchFilter when panel was opened via Random", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleRandomMovie();
    });
    act(() => {
      result.current.handleClosePanel();
    });
    expect(result.current.activeFilter).toBeNull();
  });

  it("increments searchResetKey when panel was opened via Random", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleRandomMovie();
    });
    const before = result.current.searchResetKey;
    act(() => {
      result.current.handleClosePanel();
    });
    expect(result.current.searchResetKey).toBe(before + 1);
  });

  it("does NOT increment searchResetKey for non-random close", () => {
    const { result } = renderHook(() => useAppState());
    act(() => {
      result.current.handleSelectMovie(MOVIES[0]);
    });
    const before = result.current.searchResetKey;
    act(() => {
      result.current.handleClosePanel();
    });
    expect(result.current.searchResetKey).toBe(before);
  });

  it("subsequent handleClosePanel after random does NOT clear search again", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const { result } = renderHook(() => useAppState());
    // open via random then close (resets to fresh state)
    act(() => {
      result.current.handleRandomMovie();
    });
    act(() => {
      result.current.handleClosePanel();
    });
    // manually set a search filter and close again (not a random close)
    act(() => {
      result.current.handleSearchFilter(new Set(["Bullitt"]));
    });
    act(() => {
      result.current.handleSelectMovie(MOVIES[1]);
    });
    const keyBefore = result.current.searchResetKey;
    act(() => {
      result.current.handleClosePanel();
    });
    // randomActive was reset to false — searchResetKey must NOT increment again
    expect(result.current.searchResetKey).toBe(keyBefore);
  });
});
