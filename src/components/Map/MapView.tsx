import { useRef, useCallback, useState, useEffect } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { Film, MapPin, Lightbulb, X } from "lucide-react";
import type { MapMarker } from "../../types";
import strings from "../../en.json";
import {
  colors,
  counterBadge,
  markerTooltip,
  popupCard,
  closeButtonSm,
  redIconBadge,
  locationPin,
  mapWrapper,
  mapFill,
  markerWrapper,
  tooltipAccent,
  tooltipYear,
  popupHeaderRow,
  popupTitle,
  popupYear,
  popupLocationCard,
  iconTextRow,
  funFactRow,
  iconInline,
  popupLocationText,
  popupFunFactText,
  popupFooter,
  counterHighlight,
  popupContainerStyle,
} from "../../theme";

const SF_CENTER = { longitude: -122.4194, latitude: 37.7749, zoom: 13 };
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

interface LocationPinProps {
  selected: boolean;
  hovered: boolean;
}

function LocationPin({ selected, hovered }: LocationPinProps) {
  return <div style={locationPin(selected, hovered)} />;
}

interface MapViewProps {
  markers: MapMarker[];
  filteredTitles: Set<string> | null;
  onMarkerClick: (marker: MapMarker) => void;
  selectedMarkerId: string | null;
}

export default function MapView({
  markers,
  filteredTitles,
  onMarkerClick,
  selectedMarkerId,
}: MapViewProps) {
  const mapRef = useRef(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [popup, setPopup] = useState<MapMarker | null>(null);

  // Clear any open popup whenever the active filter changes (e.g. Random button).
  // Without this, a popup belonging to a now-filtered-out movie would remain
  // visible on the map even though its marker is no longer rendered.
  useEffect(() => {
    setPopup(null);
    setPopup(null);
  }, [filteredTitles]);

  const handleMarkerClick = useCallback(
    (marker: MapMarker, e: { originalEvent?: Event }) => {
      e.originalEvent?.stopPropagation();
      setPopup(marker);
      onMarkerClick(marker);
    },
    [onMarkerClick],
  );

  const visibleMarkers = filteredTitles
    ? markers.filter((m) => filteredTitles.has(m.movieTitle))
    : markers;

  return (
    <div style={mapWrapper}>
      <Map
        ref={mapRef}
        initialViewState={SF_CENTER}
        mapStyle={MAP_STYLE}
        style={mapFill}
        attributionControl={false}
        onClick={() => setPopup(null)}
      >
        <NavigationControl position="bottom-right" showCompass={true} />

        {visibleMarkers.map((marker) => {
          const isSelected = marker.id === selectedMarkerId;
          const isHovered = marker.id === hoveredId;

          return (
            <Marker
              key={marker.id}
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="center"
              onClick={(e) => handleMarkerClick(marker, e)}
            >
              <div
                onMouseEnter={() => setHoveredId(marker.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={markerWrapper}
              >
                <LocationPin selected={isSelected} hovered={isHovered} />

                {isHovered && !isSelected && (
                  <div style={markerTooltip}>
                    <span style={tooltipAccent}>▶</span>
                    {marker.movieTitle}
                    {marker.releaseYear && (
                      <span style={tooltipYear}>{marker.releaseYear}</span>
                    )}
                  </div>
                )}
              </div>
            </Marker>
          );
        })}

        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            offset={[0, -10]}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopup(null)}
            style={popupContainerStyle}
          >
            <div style={popupCard}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopup(null);
                }}
                style={closeButtonSm}
              >
                <X size={12} color={colors.textSec} />
              </button>

              <div style={popupHeaderRow}>
                <div style={redIconBadge(30)}>
                  <Film size={15} color={colors.white} />
                </div>
                <div>
                  <p style={popupTitle}>{popup.movieTitle}</p>
                  {popup.releaseYear && (
                    <span style={popupYear}>{popup.releaseYear}</span>
                  )}
                </div>
              </div>

              <div style={popupLocationCard}>
                <div style={iconTextRow}>
                  <MapPin size={12} color={colors.red} style={iconInline} />
                  <p style={popupLocationText}>{popup.description}</p>
                </div>

                {popup.funFact && (
                  <div style={funFactRow}>
                    <Lightbulb
                      size={11}
                      color={colors.accent}
                      style={iconInline}
                    />
                    <p style={popupFunFactText}>{popup.funFact}</p>
                  </div>
                )}
              </div>

              <p style={popupFooter}>{strings.map.popupFooter}</p>
            </div>
          </Popup>
        )}
      </Map>

      <div style={counterBadge}>
        <span style={counterHighlight}>{visibleMarkers.length}</span>{" "}
        {strings.map.counterFilming}{" "}
        {visibleMarkers.length === 1
          ? strings.map.counterLocationSingular
          : strings.map.counterLocationPlural}{" "}
        {strings.map.counterSuffix}
      </div>
    </div>
  );
}
