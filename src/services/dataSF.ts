import type { RawRow, Movie, MovieLocation } from "../types";
import { logger } from "../utils/logger";

/**
 * Base URL for the DataSF Film Locations endpoint.
 * Configured via the VITE_DATASF_API_URL environment variable (see .env.example).
 */
const API_URL = import.meta.env.VITE_DATASF_API_URL as string | undefined;

/**
 * Fetches film location rows from the DataSF API.
 *
 * Throws a descriptive error on:
 *  - missing environment variable configuration
 *  - non-2xx HTTP responses
 *  - empty or non-array response bodies
 *  - network-level failures (propagated from fetch)
 */
export async function fetchFilmLocations(): Promise<RawRow[]> {
  if (!API_URL) {
    throw new Error(
      "VITE_DATASF_API_URL is not configured. Copy .env.example to .env and fill in the value.",
    );
  }

  logger.info("Fetching film locations", { url: API_URL });

  const res = await fetch(API_URL);
  if (!res.ok) {
    logger.error("DataSF API returned a non-OK response", {
      status: res.status,
    });
    throw new Error(`DataSF API error: HTTP ${res.status}`);
  }

  const data: RawRow[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) {
    logger.warn("DataSF API returned no data");
    throw new Error("DataSF API returned no data");
  }

  logger.info("Film locations fetched successfully", { rowCount: data.length });
  return data;
}

/**
 * Normalise raw DataSF rows into a clean Movie structure.
 *
 * Rows without a title, location, or valid co-ordinates are silently skipped —
 * the DataSF dataset contains some incomplete entries.  Multiple rows sharing
 * the same title are merged into a single Movie with multiple locations.
 */
export function normaliseMovies(rawRows: RawRow[]): Movie[] {
  const movieMap = new Map<string, Movie>();

  for (const row of rawRows) {
    const title = (row.title || "").trim();
    if (!title) continue;

    const lat = parseFloat(row.latitude);
    const lng = parseFloat(row.longitude);

    if (!row.locations || isNaN(lat) || isNaN(lng)) continue;

    if (!movieMap.has(title)) {
      movieMap.set(title, {
        id: title,
        title,
        releaseYear: row.release_year ? parseInt(row.release_year, 10) : null,
        director: row.director || null,
        writer: row.writer || null,
        actors: [row.actor_1, row.actor_2, row.actor_3].filter(Boolean),
        productionCompany: row.production_company || null,
        distributor: row.distributor || null,
        locations: [],
      });
    }

    const loc: MovieLocation = {
      description: row.locations,
      funFact: row.fun_facts || null,
      lat,
      lng,
    };
    movieMap.get(title)!.locations.push(loc);
  }

  const movies = Array.from(movieMap.values());
  logger.debug("Movies normalised", {
    inputRows: rawRows.length,
    movieCount: movies.length,
  });
  return movies;
}
