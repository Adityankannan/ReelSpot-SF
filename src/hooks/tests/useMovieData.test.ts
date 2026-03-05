import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useMovieData } from "../useMovieData";
import * as dataSF from "../../services/dataSF";
import type { RawRow } from "../../types";

function makeRow(overrides: Partial<RawRow> = {}): RawRow {
  return {
    title: "Vertigo",
    release_year: "1958",
    locations: "Mission Dolores",
    fun_facts: "",
    director: "Alfred Hitchcock",
    writer: "Alec Coppel",
    actor_1: "James Stewart",
    actor_2: "Kim Novak",
    actor_3: "",
    production_company: "Paramount",
    distributor: "Paramount",
    latitude: "37.7645",
    longitude: "-122.4268",
    ...overrides,
  };
}

describe("useMovieData", () => {
  beforeEach(() => {
    vi.spyOn(dataSF, "fetchFilmLocations");
    vi.spyOn(dataSF, "normaliseMovies");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts with loading=true and empty state", () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([makeRow()]);
    const { result } = renderHook(() => useMovieData());

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);
    expect(result.current.markers).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("populates movies and markers after successful fetch", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([makeRow()]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.movies).toHaveLength(1);
    expect(result.current.movies[0].title).toBe("Vertigo");
    expect(result.current.markers).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("builds markers with correct id format", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([makeRow()]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.markers[0].id).toBe("Vertigo__Mission Dolores");
  });

  it("creates one marker per unique location", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([
      makeRow({
        locations: "City Hall",
        latitude: "37.77",
        longitude: "-122.41",
      }),
      makeRow({
        locations: "Golden Gate",
        latitude: "37.82",
        longitude: "-122.47",
      }),
    ]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.markers).toHaveLength(2);
  });

  it("sets error when fetch throws", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockRejectedValue(
      new Error("API down"),
    );

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("API down");
    expect(result.current.movies).toEqual([]);
  });

  it("search returns all movies when query is empty", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([makeRow()]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const found = result.current.search("");
    expect(found).toHaveLength(1);
  });

  it("search returns matching movies", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([
      makeRow({ title: "Vertigo" }),
      makeRow({
        title: "Bullitt",
        director: "Peter Yates",
        locations: "Russian Hill",
        latitude: "37.80",
        longitude: "-122.41",
      }),
    ]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const found = result.current.search("Vertigo");
    expect(found.map((m) => m.title)).toContain("Vertigo");
  });

  it("marker carries releaseYear from the movie", async () => {
    vi.mocked(dataSF.fetchFilmLocations).mockResolvedValue([makeRow()]);

    const { result } = renderHook(() => useMovieData());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.markers[0].releaseYear).toBe(1958);
  });
});
