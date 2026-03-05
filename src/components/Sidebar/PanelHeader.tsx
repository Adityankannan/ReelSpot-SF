import { Film } from "lucide-react";
import type { Movie } from "../../types";
import {
  colors,
  panelHeaderRow,
  redIconBadge,
  panelTitle,
  panelYear,
} from "../../theme";

interface PanelHeaderProps {
  title: Movie["title"];
  releaseYear: Movie["releaseYear"];
}

export default function PanelHeader({ title, releaseYear }: PanelHeaderProps) {
  return (
    <div style={panelHeaderRow}>
      <div style={redIconBadge(44)}>
        <Film size={20} color={colors.white} />
      </div>
      <div>
        <h2 style={panelTitle}>{title}</h2>
        {releaseYear && <span style={panelYear}>{releaseYear}</span>}
      </div>
    </div>
  );
}
