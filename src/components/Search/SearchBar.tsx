import { useState, useRef, useCallback } from "react";
import Fuse from "fuse.js";
import { Search, X, Film } from "lucide-react";
import type { Movie } from "../../types";
import strings from "../../en.json";
import {
  colors,
  fonts,
  searchWrapper,
  searchInputRow,
  searchInput,
  searchClearBtn,
  searchDropdown,
  suggestionRow,
  suggestionIconBadge,
  suggestionTextCol,
  suggestionTitle,
  suggestionMeta,
  iconFlexShrink,
} from "../../theme";

interface SearchBarProps {
  movies: Movie[];
  onFilter: (titles: Set<string> | null) => void;
  onSelectMovie: (movie: Movie | null) => void;
}

export default function SearchBar({
  movies,
  onFilter,
  onSelectMovie,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [open, setOpen] = useState(false);
  const fuseRef = useRef<Fuse<Movie> | null>(null);

  if (!fuseRef.current && movies.length) {
    fuseRef.current = new Fuse(movies, {
      keys: ["title", "director", "actors", "releaseYear"],
      threshold: 0.35,
      includeScore: true,
    });
  }

  const handleChange = useCallback(
    (val: string) => {
      setQuery(val);
      if (!val.trim()) {
        setSuggestions([]);
        setOpen(false);
        onFilter(null);
        return;
      }
      if (!fuseRef.current) return;
      const results = fuseRef.current
        .search(val)
        .slice(0, 8)
        .map((r) => r.item);
      setSuggestions(results);
      setOpen(results.length > 0);
      onFilter(new Set(results.map((m) => m.title)));
    },
    [onFilter],
  );

  function selectMovie(movie: Movie) {
    setQuery(movie.title);
    setSuggestions([]);
    setOpen(false);
    onFilter(new Set([movie.title]));
    onSelectMovie(movie);
  }

  function clear() {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onFilter(null);
    onSelectMovie(null);
  }

  return (
    <div style={searchWrapper}>
      <div style={searchInputRow}>
        <Search size={16} color={colors.textSec} style={iconFlexShrink} />
        <input
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          placeholder={strings.controls.searchPlaceholder}
          style={searchInput}
        />
        {query && (
          <button onClick={clear} style={searchClearBtn}>
            <X size={14} color={colors.textSec} />
          </button>
        )}
      </div>

      {open && (
        <div style={searchDropdown}>
          {suggestions.map((movie) => (
            <button
              key={movie.id}
              onClick={() => selectMovie(movie)}
              style={suggestionRow}
            >
              <div style={suggestionIconBadge}>
                <Film size={14} color={colors.red} />
              </div>
              <div style={suggestionTextCol}>
                <span style={suggestionTitle}>{movie.title}</span>
                <span style={suggestionMeta}>
                  {[movie.releaseYear, movie.director]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
