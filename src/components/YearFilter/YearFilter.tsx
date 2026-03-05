import { useState } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import type { Movie } from "../../types";
import strings from "../../en.json";
import {
  colors,
  fonts,
  yearFilterBtn,
  yearDecadeBtn,
  yearDropdown,
  posRelative,
} from "../../theme";

interface YearFilterProps {
  movies: Movie[];
  onYearFilter: (titles: Set<string> | null) => void;
}

const DECADES = [
  1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
];

export default function YearFilter({ movies, onYearFilter }: YearFilterProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  function pickDecade(decade: number | null) {
    setSelected(decade);
    setOpen(false);
    if (decade === null) {
      onYearFilter(null);
      return;
    }
    const titles = new Set(
      movies
        .filter(
          (m) =>
            m.releaseYear !== null &&
            m.releaseYear >= decade &&
            m.releaseYear < decade + 10,
        )
        .map((m) => m.title),
    );
    onYearFilter(titles.size ? titles : new Set());
  }

  const decadesWithData = DECADES.filter((d) =>
    movies.some(
      (m) =>
        m.releaseYear !== null && m.releaseYear >= d && m.releaseYear < d + 10,
    ),
  );

  return (
    <div style={posRelative}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={yearFilterBtn(!!selected)}
      >
        <Calendar size={14} />
        {selected ? `${selected}s` : strings.controls.yearFilterDefault}
        {selected ? (
          <X
            size={13}
            onClick={(e) => {
              e.stopPropagation();
              pickDecade(null);
            }}
          />
        ) : (
          <ChevronDown size={13} />
        )}
      </button>

      {open && (
        <div style={yearDropdown}>
          {decadesWithData.map((d) => (
            <button
              key={d}
              onClick={() => pickDecade(d)}
              style={yearDecadeBtn(selected === d)}
            >
              {d}s
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
