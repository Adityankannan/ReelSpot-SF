import type { MovieLocation } from "../../types";
import strings from "../../en.json";
import {
  locationsSectionWrapper,
  locationsSectionHeader,
  locationsList,
} from "../../theme";
import LocationItem from "./LocationItem";

interface LocationsSectionProps {
  locations: MovieLocation[];
}

export default function LocationsSection({ locations }: LocationsSectionProps) {
  return (
    <div style={locationsSectionWrapper}>
      <p style={locationsSectionHeader}>
        {strings.panel.filmingLocationsPrefix} ({locations.length})
      </p>
      <div style={locationsList}>
        {locations.map((loc, i) => (
          <LocationItem key={i} location={loc} />
        ))}
      </div>
    </div>
  );
}
