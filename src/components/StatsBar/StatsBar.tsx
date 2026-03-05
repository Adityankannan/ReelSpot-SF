import { Film, MapPin } from "lucide-react";
import { colors, statsPill, dividerV, statCount, statLabel } from "../../theme";
import strings from "../../en.json";

interface StatsBarProps {
  totalMovies: number;
  totalMarkers: number;
}

export default function StatsBar({ totalMovies, totalMarkers }: StatsBarProps) {
  return (
    <div style={statsPill}>
      <Film size={13} color={colors.accent} />
      <span style={statCount}>{totalMovies}</span>
      <span style={statLabel}>{strings.stats.movies}</span>

      <div style={dividerV} />

      <MapPin size={13} color={colors.red} />
      <span style={statCount}>{totalMarkers}</span>
      <span style={statLabel}>{strings.stats.locationsMapped}</span>
    </div>
  );
}
