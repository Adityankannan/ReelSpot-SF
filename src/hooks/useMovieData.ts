import { useState, useEffect, useRef } from "react";
import Fuse from "fuse.js";
import { fetchFilmLocations, normaliseMovies } from "../services/dataSF";
import { logger } from "../utils/logger";
import type { Movie, MapMarker } from "../types";

interface UseMovieDataReturn {
  movies: Movie[];
  markers: MapMarker[];
  loading: boolean;
  error: string | null;
  search: (query: string) => Movie[];
}

export function useMovieData(): UseMovieDataReturn {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fuseRef = useRef<Fuse<Movie> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      logger.info("useMovieData: starting data load");
      try {
        const rawRows = await fetchFilmLocations();
        if (cancelled) return;

        const normalised = normaliseMovies(rawRows);

        const resolvedMarkers: MapMarker[] = [];
        for (const movie of normalised) {
          for (const loc of movie.locations) {
            resolvedMarkers.push({
              id: `${movie.title}__${loc.description}`,
              movieTitle: movie.title,
              releaseYear: movie.releaseYear,
              description: loc.description,
              funFact: loc.funFact,
              lat: loc.lat,
              lng: loc.lng,
            });
          }
        }

        logger.info("useMovieData: data load complete", {
          movies: normalised.length,
          markers: resolvedMarkers.length,
        });

        setMovies(normalised);
        setMarkers(resolvedMarkers);
        setLoading(false);

        fuseRef.current = new Fuse(normalised, {
          keys: ["title", "director", "actors", "releaseYear"],
          threshold: 0.3,
          includeScore: true,
        });
      } catch (err) {
        if (!cancelled) {
          logger.error("useMovieData: data load failed", {
            message: (err as Error).message,
          });
          setError((err as Error).message);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function search(query: string): Movie[] {
    if (!query || !fuseRef.current) return movies;
    return fuseRef.current.search(query).map((r) => r.item);
  }

  return { movies, markers, loading, error, search };
}
