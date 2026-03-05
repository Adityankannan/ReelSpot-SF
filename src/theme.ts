import type { CSSProperties } from "react";

// ─── Colour tokens ────────────────────────────────────────────────────────────
export const colors = {
  bgDeep: "#0a0a0f",
  bgCard: "#13131c",
  bgRaised: "#1c1c2b",
  bgOverlay: "rgba(19,19,28,0.92)",
  bgOverlayDark: "rgba(10,10,15,0.85)",
  bgOverlayDeep: "rgba(10,10,15,0.96)",
  bgOverlaySheet: "rgba(13,13,20,0.97)",
  bgFaint: "rgba(255,255,255,0.03)",
  bgFainter: "rgba(255,255,255,0.04)",
  bgFaintest: "rgba(255,255,255,0.07)",

  border: "rgba(255,255,255,0.07)",
  borderLight: "rgba(255,255,255,0.06)",
  borderFaint: "rgba(255,255,255,0.05)",
  borderSubtle: "rgba(255,255,255,0.1)",
  borderRed: "rgba(231,76,60,0.35)",
  borderRedStrong: "rgba(231,76,60,0.5)",

  accent: "#f5c518", // IMDb gold
  accentDim: "#c9a216",
  red: "#e74c3c",
  redDark: "#c0392b",
  orange: "#e85d04",
  pink: "#c9516a",

  textPri: "#f0f0f0",
  textSec: "#9898b3",
  textMuted: "#5a5a75",
  textDim: "#6a6a85",
  white: "#fff",
  black: "#0a0a0f",
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
export const fonts = {
  sans: "Montserrat, sans-serif",
  serif: "Playfair Display, serif",
} as const;

// ─── Spacing / sizing ─────────────────────────────────────────────────────────
export const radius = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 12,
  xxl: 18,
  full: "50%",
} as const;

// ─── Shadows ─────────────────────────────────────────────────────────────────
export const shadows = {
  card: "0 8px 32px rgba(0,0,0,0.5)",
  popup: "0 8px 32px rgba(0,0,0,0.8)",
  tooltip: "0 4px 16px rgba(0,0,0,0.7)",
  icon: "0 2px 8px rgba(231,76,60,0.4)",
  logo: "0 4px 20px rgba(245,197,24,0.35)",
  markerNormal: "0 1px 4px rgba(0,0,0,0.45)",
  markerSelected: "0 0 0 4px rgba(248,197,24,0.35), 0 2px 6px rgba(0,0,0,0.5)",
} as const;

// ─── Reusable style objects ───────────────────────────────────────────────────

/** Glass-morphism panel surface used by search bar, dropdowns, buttons */
export const glassPanel: CSSProperties = {
  background: colors.bgOverlay,
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: radius.lg,
  backdropFilter: "blur(12px)",
};

/** Inset card used inside panels */
export const insetCard: CSSProperties = {
  background: colors.bgFainter,
  border: `1px solid ${colors.borderLight}`,
  borderRadius: radius.md,
};

/** Red-gradient icon badge */
export const redIconBadge = (size: number): CSSProperties => ({
  width: size,
  height: size,
  borderRadius: radius.md,
  background: `linear-gradient(135deg, ${colors.red}, ${colors.redDark})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: shadows.icon,
});

/** Close button (circular) */
export const closeButton: CSSProperties = {
  background: colors.bgFaintest,
  border: "none",
  borderRadius: radius.full,
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};

/** Small close button variant (22px) */
export const closeButtonSm: CSSProperties = {
  ...closeButton,
  width: 22,
  height: 22,
  padding: 0,
  position: "absolute",
  top: 8,
  right: 8,
};

/** Overlay button (search bar, random, year) shared base */
export const overlayButton: CSSProperties = {
  ...glassPanel,
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 14px",
  cursor: "pointer",
  color: colors.textSec,
  fontSize: 13,
  fontWeight: 600,
  fontFamily: fonts.sans,
  whiteSpace: "nowrap",
  border: `1px solid ${colors.borderSubtle}`,
};

/** Gradient title text (CineMap SF heading) */
export const gradientTitle: CSSProperties = {
  fontFamily: fonts.sans,
  fontSize: 20,
  fontWeight: 400,
  color: "#ffffff",
  textShadow: "0 1px 3px rgba(0,0,0,0.9)",
  letterSpacing: "0.01em",
  lineHeight: 1.1,
};

/** Map counter badge (bottom-left) */
export const counterBadge: CSSProperties = {
  position: "absolute",
  bottom: 16,
  left: 16,
  background: colors.bgOverlayDark,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.md,
  padding: "6px 12px",
  fontSize: 12,
  color: colors.textSec,
  backdropFilter: "blur(8px)",
  pointerEvents: "none",
};

/** Popup card container */
export const popupCard: CSSProperties = {
  background: colors.bgCard,
  border: `1px solid ${colors.borderRed}`,
  borderRadius: radius.lg,
  padding: "12px 14px",
  minWidth: 220,
  maxWidth: 280,
  fontFamily: fonts.sans,
  boxShadow: shadows.popup,
  position: "relative",
};

/** Marker hover tooltip */
export const markerTooltip: CSSProperties = {
  position: "absolute",
  bottom: "105%",
  left: "50%",
  transform: "translateX(-50%)",
  background: colors.bgOverlayDeep,
  border: `1px solid ${colors.borderRed}`,
  borderRadius: radius.md - 1,
  padding: "5px 10px",
  whiteSpace: "nowrap",
  fontSize: 11,
  fontWeight: 700,
  color: colors.textPri,
  pointerEvents: "none",
  maxWidth: 220,
  overflow: "hidden",
  textOverflow: "ellipsis",
  boxShadow: shadows.tooltip,
  zIndex: 10,
};

/** Side detail panel shell */
export const detailPanelShell: CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  width: 360,
  background: colors.bgOverlaySheet,
  borderLeft: `1px solid ${colors.border}`,
  backdropFilter: "blur(20px)",
  overflowY: "auto",
  zIndex: 60,
  padding: "20px 18px",
  fontFamily: fonts.sans,
};

/** Credits / metadata block inside detail panel */
export const creditsBlock: CSSProperties = {
  marginTop: 16,
  padding: "12px 14px",
  background: colors.bgFaint,
  borderRadius: radius.lg,
  border: `1px solid ${colors.borderFaint}`,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

/** Individual location row inside detail panel */
export const locationRow: CSSProperties = {
  padding: "10px 12px",
  background: colors.bgFaint,
  borderRadius: radius.md,
  border: `1px solid ${colors.borderFaint}`,
};

/** Logo badge (App header icon) */
export const logoBadge: CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: radius.xl,
  background: "#0f0f18",
  border: `2px solid #22c55e`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  boxShadow: `0 0 0 1px rgba(34,197,94,0.15), 0 4px 20px rgba(0,0,0,0.6)`,
};

/** Loading screen container */
export const loadingContainer: CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: colors.bgDeep,
  fontFamily: fonts.sans,
  gap: 20,
};

/** Loading screen icon badge */
export const loadingIconBadge: CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: radius.xxl,
  background: `radial-gradient(circle at 30% 30%, ${colors.accent}, ${colors.pink})`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 8px 32px rgba(245,197,24,0.3)",
};

/** Stats bar pill */
export const statsPill: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  background: "rgba(19,19,28,0.92)",
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: radius.lg,
  padding: "7px 14px",
  backdropFilter: "blur(12px)",
  pointerEvents: "auto",
};

/** Thin vertical divider */
export const dividerV: CSSProperties = {
  width: 1,
  height: 14,
  background: "rgba(255,255,255,0.12)",
  margin: "0 4px",
};

// ─── App layout ───────────────────────────────────────────────────────────────

/** Root app container (full-viewport) */
export const appRoot: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
  overflow: "hidden",
};

/** Top overlay panel (static portion — right offset applied inline because it's dynamic) */
export const overlayPanel: CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  padding: "16px 16px 0",
  pointerEvents: "none",
  zIndex: 50,
  transition: "right 0.4s cubic-bezier(0.32,0.72,0,1)",
};

/** Brand header row (logo + title) */
export const brandRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  marginBottom: 12,
  pointerEvents: "auto",
  background: "rgba(10,10,15,0.72)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: `1px solid rgba(255,255,255,0.09)`,
  borderRadius: 14,
  padding: "8px 14px 8px 10px",
  width: "fit-content",
};

/** App subtitle under the heading */
export const appSubtitle: CSSProperties = {
  fontSize: 10,
  color: colors.textSec,
  marginTop: 1,
  letterSpacing: "0.04em",
};

/** Search + filter controls row */
export const controlsRow: CSSProperties = {
  display: "flex",
  gap: 8,
  marginBottom: 10,
  pointerEvents: "auto",
};

/** Stats row wrapper */
export const statsRow: CSSProperties = {
  pointerEvents: "auto",
};

// ─── SearchBar ────────────────────────────────────────────────────────────────

/** Outer wrapper (fills available flex width) */
export const searchWrapper: CSSProperties = {
  position: "relative",
  flex: 1,
};

/** Input row inside the glass box */
export const searchInputRow: CSSProperties = {
  ...glassPanel,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 14px",
};

/** The <input> element itself */
export const searchInput: CSSProperties = {
  flex: 1,
  background: "transparent",
  border: "none",
  outline: "none",
  fontSize: 14,
  color: colors.textPri,
  fontFamily: fonts.sans,
};

/** Clear (×) button inside the search box */
export const searchClearBtn: CSSProperties = {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 0,
  display: "flex",
};

/** Dropdown suggestion list */
export const searchDropdown: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  left: 0,
  right: 0,
  background: "rgba(19,19,28,0.98)",
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: radius.lg,
  overflow: "hidden",
  zIndex: 1000,
  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  backdropFilter: "blur(12px)",
};

/** Individual suggestion row button */
export const suggestionRow: CSSProperties = {
  width: "100%",
  background: "none",
  border: "none",
  borderBottom: `1px solid ${colors.borderFaint}`,
  padding: "9px 14px",
  textAlign: "left",
  cursor: "pointer",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
};

/** Icon badge on the left of each suggestion */
export const suggestionIconBadge: CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: colors.bgRaised,
  border: `1px solid ${colors.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

/** Text column (title + meta) on the right of suggestion icon */
export const suggestionTextCol: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  minWidth: 0,
};

/** Suggestion primary text */
export const suggestionTitle: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  fontFamily: fonts.sans,
  color: colors.textPri,
};

/** Suggestion secondary (year · director) */
export const suggestionMeta: CSSProperties = {
  fontSize: 11,
  fontFamily: fonts.sans,
  color: colors.textSec,
};

// ─── YearFilter ───────────────────────────────────────────────────────────────

/** Dropdown list container */
export const yearDropdown: CSSProperties = {
  position: "absolute",
  top: "calc(100% + 6px)",
  right: 0,
  background: "rgba(19,19,28,0.98)",
  border: `1px solid ${colors.borderSubtle}`,
  borderRadius: radius.lg,
  overflow: "hidden",
  zIndex: 1000,
  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  backdropFilter: "blur(12px)",
  minWidth: 120,
};

// ─── MapView ──────────────────────────────────────────────────────────────────

/** Map outer wrapper */
export const mapWrapper: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "relative",
};

/** Passed directly to <Map style={}> */
export const mapFill: CSSProperties = {
  width: "100%",
  height: "100%",
};

/** Individual marker wrapper */
export const markerWrapper: CSSProperties = {
  cursor: "pointer",
  position: "relative",
};

/** Tooltip accent (▶ character) */
export const tooltipAccent: CSSProperties = {
  color: colors.red,
  marginRight: 5,
};

/** Tooltip year text */
export const tooltipYear: CSSProperties = {
  color: colors.textSec,
  fontWeight: 400,
  marginLeft: 5,
};

/** Popup header row (icon + title) */
export const popupHeaderRow: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "flex-start",
  paddingRight: 24,
};

/** Popup movie title */
export const popupTitle: CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: colors.textPri,
  lineHeight: 1.3,
  margin: 0,
};

/** Popup release year */
export const popupYear: CSSProperties = {
  fontSize: 11,
  color: colors.red,
  fontWeight: 700,
};

/** Popup inset location card (extends insetCard with top margin + custom padding) */
export const popupLocationCard: CSSProperties = {
  ...insetCard,
  marginTop: 10,
  padding: "7px 10px",
};

/** Row inside popup / detail panel used for icon + text pairs */
export const iconTextRow: CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "flex-start",
};

/** Row for fun-fact with top spacing */
export const funFactRow: CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "flex-start",
  marginTop: 6,
};

/** Icon inline style (pin + lightbulb) */
export const iconInline: CSSProperties = {
  marginTop: 2,
  flexShrink: 0,
};

/** Popup location description text */
export const popupLocationText: CSSProperties = {
  fontSize: 12,
  color: colors.textSec,
  margin: 0,
  lineHeight: 1.4,
};

/** Popup fun-fact text */
export const popupFunFactText: CSSProperties = {
  fontSize: 11,
  color: colors.textMuted,
  margin: 0,
  lineHeight: 1.4,
  fontStyle: "italic",
};

/** Popup footer hint */
export const popupFooter: CSSProperties = {
  fontSize: 10,
  color: colors.textMuted,
  margin: "8px 0 0",
  textAlign: "center",
};

/** Counter badge count highlight */
export const counterHighlight: CSSProperties = {
  color: colors.red,
  fontWeight: 700,
};

// ─── MovieDetailPanel ─────────────────────────────────────────────────────────

/** Panel header row (icon badge + title block) */
export const panelHeaderRow: CSSProperties = {
  display: "flex",
  gap: 12,
  alignItems: "flex-start",
  paddingRight: 36,
};

/** Panel movie title h2 */
export const panelTitle: CSSProperties = {
  fontFamily: fonts.serif,
  fontSize: 18,
  fontWeight: 900,
  color: colors.textPri,
  lineHeight: 1.25,
  margin: 0,
};

/** Panel release year */
export const panelYear: CSSProperties = {
  fontSize: 12,
  color: colors.red,
  fontWeight: 700,
};

/** Credit row (icon + label/value pair) */
export const creditRow: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "center",
};

/** Credit row — top-aligned variant (actors) */
export const creditRowTop: CSSProperties = {
  display: "flex",
  gap: 8,
  alignItems: "flex-start",
};

/** Credit label (DIRECTOR / CAST / PRODUCTION) */
export const creditLabel: CSSProperties = {
  fontSize: 10,
  color: colors.textMuted,
  display: "block",
};

/** Credit value text */
export const creditValue: CSSProperties = {
  fontSize: 13,
  color: colors.textPri,
  fontWeight: 600,
};

/** "FILMING LOCATIONS (n)" section heading */
export const locationsSectionHeader: CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: colors.textMuted,
  letterSpacing: "0.08em",
  marginBottom: 10,
  fontFamily: fonts.sans,
};

/** Locations list container */
export const locationsList: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

/** Location row icon + text */
export const locationIconRow: CSSProperties = {
  display: "flex",
  gap: 7,
  alignItems: "flex-start",
};

/** Location description text */
export const locationDescText: CSSProperties = {
  fontSize: 12,
  color: "#c0c0d0",
  margin: 0,
  lineHeight: 1.5,
  fontWeight: 600,
};

/** Fun-fact icon + text row (with top spacing) */
export const funFactRowLg: CSSProperties = {
  display: "flex",
  gap: 7,
  alignItems: "flex-start",
  marginTop: 6,
};

/** Fun-fact text in detail panel */
export const funFactText: CSSProperties = {
  fontSize: 11,
  color: colors.textDim,
  margin: 0,
  lineHeight: 1.4,
  fontStyle: "italic",
};

/** Locations section wrapper */
export const locationsSectionWrapper: CSSProperties = {
  marginTop: 16,
};

// ─── LoadingScreen ────────────────────────────────────────────────────────────

/** Error message text */
export const loadingErrorTitle: CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: colors.red,
};

/** Error detail text */
export const loadingErrorDetail: CSSProperties = {
  fontSize: 12,
  color: colors.textSec,
  maxWidth: 320,
  textAlign: "center",
  lineHeight: 1.6,
};

/** Loading sub-label */
export const loadingSubLabel: CSSProperties = {
  fontSize: 13,
  color: colors.textSec,
  fontFamily: fonts.sans,
};

// ─── Dynamic / factory styles (values depend on runtime props) ─────────────────

/** Loading icon badge — animation toggled by error state */
export const loadingIconStyle = (hasError: boolean): CSSProperties => ({
  ...loadingIconBadge,
  animation: hasError ? "none" : "pulse 1.6s ease-in-out infinite",
});

/** Larger gradient heading (e.g. loading screen title) */
export const gradientTitleLg: CSSProperties = {
  ...gradientTitle,
  fontSize: 22,
};

/** Just position:relative — shared utility for dropdown anchors */
export const posRelative: CSSProperties = {
  position: "relative",
};

/** YearFilter trigger button — active state changes bg / border / color */
export const yearFilterBtn = (active: boolean): CSSProperties => ({
  ...overlayButton,
  background: active
    ? "rgba(231,76,60,0.15)"
    : (overlayButton.background as string),
  border: active
    ? `1px solid ${colors.borderRedStrong}`
    : `1px solid ${colors.borderSubtle}`,
  color: active ? colors.red : colors.textSec,
});

/** YearFilter decade option button */
export const yearDecadeBtn = (active: boolean): CSSProperties => ({
  width: "100%",
  background: active ? "rgba(231,76,60,0.15)" : "none",
  border: "none",
  borderBottom: `1px solid ${colors.borderFaint}`,
  padding: "9px 16px",
  textAlign: "left",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: active ? 700 : 500,
  color: active ? colors.red : colors.textPri,
  fontFamily: fonts.sans,
});

/** LocationPin circle marker */
export const locationPin = (
  selected: boolean,
  hovered: boolean,
): CSSProperties => {
  const size = selected ? 18 : hovered ? 16 : 12;
  return {
    width: size,
    height: size,
    borderRadius: "50%",
    background: selected ? colors.accent : colors.orange,
    border: selected
      ? `3px solid ${colors.white}`
      : hovered
        ? `2px solid ${colors.white}`
        : `2px solid rgba(255,255,255,0.8)`,
    boxShadow: selected ? shadows.markerSelected : shadows.markerNormal,
    transition: "width 0.1s, height 0.1s, background 0.1s, box-shadow 0.1s",
    boxSizing: "border-box",
  };
};

/** Detail panel close button (absolute-positioned) */
export const panelCloseBtn: CSSProperties = {
  ...closeButton,
  position: "absolute",
  top: 14,
  right: 14,
};

/** Icon flex-shrink only (no top margin — for inline icons) */
export const iconFlexShrink: CSSProperties = {
  flexShrink: 0,
};

/** react-map-gl Popup container z-index */
export const popupContainerStyle: CSSProperties = {
  zIndex: 200,
};

/** App overlay panel — dynamic right offset applied via factory */
export const overlayPanelStyle = (rightOffset: number): CSSProperties => ({
  ...overlayPanel,
  right: rightOffset,
});

/** Stats count number */
export const statCount: CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: colors.textPri,
};

/** Stats label word */
export const statLabel: CSSProperties = {
  fontSize: 12,
  color: colors.textSec,
};
