import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchFilmLocations, normaliseMovies } from "./dataSF";
import type { RawRow } from "../types";

// ─── Fixtures ─────────────────────────────────────────────────────────────────

function makeRow(overrides: Partial<RawRow> = {}): RawRow {
  return {
    title: "Test Movie",
    release_year: "2001",
    locations: "City Hall",
    fun_facts: "Filmed at night",
    director: "Jane Doe",
    writer: "John Smith",
    actor_1: "Actor A",
    actor_2: "Actor B",
    actor_3: "",
    production_company: "Studio X",
    distributor: "Dist Y",
    latitude: "37.7749",
    longitude: "-122.4194",
    ...overrides,
  };
}

// ─── normaliseMovies ──────────────────────────────────────────────────────────

describe("normaliseMovies", () => {
  it("returns an empty array for empty input", () => {
    expect(normaliseMovies([])).toEqual([]);
  });

  it("creates a movie entry from a valid row", () => {
    const movies = normaliseMovies([makeRow()]);
    expect(movies).toHaveLength(1);
    expect(movies[0].title).toBe("Test Movie");
    expect(movies[0].releaseYear).toBe(2001);
    expect(movies[0].director).toBe("Jane Doe");
  });

  it("groups multiple rows with the same title into one movie", () => {
    const rows = [
      makeRow({
        locations: "City Hall",
        latitude: "37.77",
        longitude: "-122.4",
      }),
      makeRow({
        locations: "Golden Gate",
        latitude: "37.82",
        longitude: "-122.47",
      }),
    ];
    const movies = normaliseMovies(rows);
    expect(movies).toHaveLength(1);
    expect(movies[0].locations).toHaveLength(2);
  });

  it("creates separate entries for different titles", () => {
    const rows = [makeRow({ title: "Movie A" }), makeRow({ title: "Movie B" })];
    const movies = normaliseMovies(rows);
    expect(movies).toHaveLength(2);
    expect(movies.map((m) => m.title)).toContain("Movie A");
    expect(movies.map((m) => m.title)).toContain("Movie B");
  });

  it("skips rows with empty title", () => {
    const movies = normaliseMovies([makeRow({ title: "" })]);
    expect(movies).toHaveLength(0);
  });

  it("skips rows with missing location description", () => {
    const movies = normaliseMovies([makeRow({ locations: "" })]);
    expect(movies).toHaveLength(0);
  });

  it("skips rows with invalid latitude", () => {
    const movies = normaliseMovies([makeRow({ latitude: "not-a-number" })]);
    expect(movies).toHaveLength(0);
  });

  it("skips rows with invalid longitude", () => {
    const movies = normaliseMovies([makeRow({ longitude: "NaN" })]);
    expect(movies).toHaveLength(0);
  });

  it("stores lat/lng on each MovieLocation", () => {
    const movies = normaliseMovies([
      makeRow({ latitude: "37.77", longitude: "-122.4" }),
    ]);
    expect(movies[0].locations[0].lat).toBe(37.77);
    expect(movies[0].locations[0].lng).toBe(-122.4);
  });

  it("sets releaseYear to null when missing", () => {
    const movies = normaliseMovies([makeRow({ release_year: "" })]);
    expect(movies[0].releaseYear).toBeNull();
  });

  it("filters empty actor strings", () => {
    const movies = normaliseMovies([
      makeRow({ actor_1: "Actor A", actor_2: "", actor_3: "" }),
    ]);
    expect(movies[0].actors).toEqual(["Actor A"]);
  });

  it("collects all three actors when present", () => {
    const movies = normaliseMovies([
      makeRow({ actor_1: "A", actor_2: "B", actor_3: "C" }),
    ]);
    expect(movies[0].actors).toEqual(["A", "B", "C"]);
  });

  it("stores fun_facts on the location", () => {
    const movies = normaliseMovies([
      makeRow({ fun_facts: "Secret tunnel used" }),
    ]);
    expect(movies[0].locations[0].funFact).toBe("Secret tunnel used");
  });

  it("sets funFact to null when fun_facts is empty", () => {
    const movies = normaliseMovies([makeRow({ fun_facts: "" })]);
    expect(movies[0].locations[0].funFact).toBeNull();
  });

  it("only uses the first row's metadata for a shared title", () => {
    const rows = [
      makeRow({ director: "First Director", locations: "Loc1" }),
      makeRow({ director: "Second Director", locations: "Loc2" }),
    ];
    const movies = normaliseMovies(rows);
    expect(movies[0].director).toBe("First Director");
  });

  it("sets distributor and productionCompany correctly", () => {
    const movies = normaliseMovies([
      makeRow({ production_company: "Pixar", distributor: "Disney" }),
    ]);
    expect(movies[0].productionCompany).toBe("Pixar");
    expect(movies[0].distributor).toBe("Disney");
  });

  it("uses title as the movie id", () => {
    const movies = normaliseMovies([makeRow({ title: "Vertigo" })]);
    expect(movies[0].id).toBe("Vertigo");
  });
});

// ─── fetchFilmLocations ───────────────────────────────────────────────────────

describe("fetchFilmLocations", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns data on a successful response", async () => {
    const mockRows = [makeRow()];
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => mockRows,
    } as Response);

    const result = await fetchFilmLocations();
    expect(result).toEqual(mockRows);
  });

  it("throws on a non-OK HTTP response", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchFilmLocations()).rejects.toThrow(
      "DataSF API error: HTTP 500",
    );
  });

  it("throws when the API returns an empty array", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => [],
    } as Response);

    await expect(fetchFilmLocations()).rejects.toThrow(
      "DataSF API returned no data",
    );
  });

  it("throws when the API returns a non-array", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ error: "unexpected" }),
    } as Response);

    await expect(fetchFilmLocations()).rejects.toThrow(
      "DataSF API returned no data",
    );
  });

  it("throws on a network failure", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));
    await expect(fetchFilmLocations()).rejects.toThrow("Network error");
  });
});
