import { useState, useCallback } from "react";
import { useMovieData } from "./useMovieData";
import type { Movie, MapMarker } from "../types";

export function useAppState() {
  const { movies, markers, loading, error } = useMovieData();

  const [searchFilter, setSearchFilter] = useState<Set<string> | null>(null);
  const [yearFilter, setYearFilter] = useState<Set<string> | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [filterResetKey, setFilterResetKey] = useState(0);
  const [searchResetKey, setSearchResetKey] = useState(0);
  const [randomActive, setRandomActive] = useState(false);

  const activeFilter: Set<string> | null =
    searchFilter && yearFilter
      ? new Set([...searchFilter].filter((t) => yearFilter.has(t)))
      : searchFilter || yearFilter;

  const handleMarkerClick = useCallback(
    (marker: MapMarker) => {
      const movie = movies.find((m) => m.title === marker.movieTitle) ?? null;
      setSelectedMovie(movie);
      setSelectedMarkerId(marker.id);
    },
    [movies],
  );

  const handleSelectMovie = useCallback(
    (movie: Movie | null) => {
      setSelectedMovie(movie);
      if (movie) {
        const m = markers.find((mk) => mk.movieTitle === movie.title);
        setSelectedMarkerId(m ? m.id : null);
      } else {
        setSelectedMarkerId(null);
      }
    },
    [markers],
  );

  const handleSearchFilter = useCallback((titles: Set<string> | null) => {
    setSearchFilter(titles);
    if (!titles) setSelectedMovie(null);
  }, []);

  const handleYearFilter = useCallback(
    (titles: Set<string> | null) => {
      setYearFilter(titles);
      if (!titles && !searchFilter) setSelectedMovie(null);
    },
    [searchFilter],
  );

  const handleRandomMovie = useCallback(() => {
    if (!movies.length) return;
    const rand = movies[Math.floor(Math.random() * movies.length)];
    setYearFilter(null);
    setFilterResetKey((k) => k + 1);
    setSelectedMovie(rand);
    setSearchFilter(new Set([rand.title]));
    setRandomActive(true);
    const m = markers.find((mk) => mk.movieTitle === rand.title);
    setSelectedMarkerId(m ? m.id : null);
  }, [movies, markers]);

  const handleClosePanel = useCallback(() => {
    setSelectedMovie(null);
    setSelectedMarkerId(null);
    if (randomActive) {
      setSearchFilter(null);
      setRandomActive(false);
      setSearchResetKey((k) => k + 1);
    }
  }, [randomActive]);

  return {
    movies,
    markers,
    loading,
    error,
    activeFilter,
    selectedMovie,
    selectedMarkerId,
    filterResetKey,
    searchResetKey,
    handleMarkerClick,
    handleSelectMovie,
    handleSearchFilter,
    handleYearFilter,
    handleRandomMovie,
    handleClosePanel,
  };
}
