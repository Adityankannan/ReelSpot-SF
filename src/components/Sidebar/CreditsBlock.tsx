import { User, Film } from "lucide-react";
import type { Movie } from "../../types";
import strings from "../../en.json";
import {
  colors,
  creditsBlock,
  creditRow,
  creditRowTop,
  creditLabel,
  creditValue,
  iconFlexShrink,
  iconInline,
} from "../../theme";

interface CreditsBlockProps {
  director: Movie["director"];
  actors: Movie["actors"];
  productionCompany: Movie["productionCompany"];
}

export default function CreditsBlock({
  director,
  actors,
  productionCompany,
}: CreditsBlockProps) {
  return (
    <div style={creditsBlock}>
      {director && (
        <div style={creditRow}>
          <User size={13} color={colors.textSec} style={iconFlexShrink} />
          <div>
            <span style={creditLabel}>{strings.panel.directorLabel}</span>
            <span style={creditValue}>{director}</span>
          </div>
        </div>
      )}
      {actors.length > 0 && (
        <div style={creditRowTop}>
          <User size={13} color={colors.textSec} style={iconInline} />
          <div>
            <span style={creditLabel}>{strings.panel.castLabel}</span>
            <span style={creditValue}>{actors.join(", ")}</span>
          </div>
        </div>
      )}
      {productionCompany && (
        <div style={creditRow}>
          <Film size={13} color={colors.textSec} style={iconFlexShrink} />
          <div>
            <span style={creditLabel}>{strings.panel.productionLabel}</span>
            <span style={creditValue}>{productionCompany}</span>
          </div>
        </div>
      )}
    </div>
  );
}
