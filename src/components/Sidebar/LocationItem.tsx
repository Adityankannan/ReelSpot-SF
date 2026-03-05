import { MapPin, Lightbulb } from "lucide-react";
import type { MovieLocation } from "../../types";
import {
  colors,
  locationRow,
  locationIconRow,
  locationDescText,
  funFactRowLg,
  funFactText,
  iconInline,
} from "../../theme";

interface LocationItemProps {
  location: MovieLocation;
}

export default function LocationItem({ location }: LocationItemProps) {
  return (
    <div style={locationRow}>
      <div style={locationIconRow}>
        <MapPin size={12} color={colors.red} style={iconInline} />
        <p style={locationDescText}>{location.description}</p>
      </div>
      {location.funFact && (
        <div style={funFactRowLg}>
          <Lightbulb size={11} color={colors.accent} style={iconInline} />
          <p style={funFactText}>{location.funFact}</p>
        </div>
      )}
    </div>
  );
}
