import { motion, AnimatePresence } from "framer-motion";
import { Shuffle } from "lucide-react";

import { useAppState } from "./hooks/useAppState";
import MapView from "./components/Map/MapView";
import SearchBar from "./components/Search/SearchBar";
import MovieDetailPanel from "./components/Sidebar/MovieDetailPanel";
import StatsBar from "./components/StatsBar/StatsBar";
import YearFilter from "./components/YearFilter/YearFilter";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import ReelSpotPin from "./components/ReelSpotPin/ReelSpotPin";
import strings from "./en.json";
import {
  logoBadge,
  gradientTitle,
  overlayButton,
  appRoot,
  overlayPanelStyle,
  brandRow,
  appSubtitle,
  controlsRow,
  statsRow,
} from "./theme";

export default function App() {
  const {
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
  } = useAppState();

  if (loading || error) return <LoadingScreen error={error} />;

  return (
    <div style={appRoot}>
      {/* Full-screen map */}
      <MapView
        markers={markers}
        filteredTitles={activeFilter}
        onMarkerClick={handleMarkerClick}
        selectedMarkerId={selectedMarkerId}
      />

      {/* Top overlay panel */}
      <div style={overlayPanelStyle(selectedMovie ? 360 : 0)}>
        {/* Brand header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={brandRow}
        >
          <div style={logoBadge}>
            <ReelSpotPin size={22} />
          </div>
          <div>
            <h1 style={gradientTitle}>{strings.brand.appName}</h1>
            <p style={appSubtitle}>{strings.brand.appSubtitle}</p>
          </div>
        </motion.div>

        {/* Search + filter row */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          style={controlsRow}
        >
          <SearchBar
            key={searchResetKey}
            movies={movies}
            onFilter={handleSearchFilter}
            onSelectMovie={handleSelectMovie}
          />
          <YearFilter
            key={filterResetKey}
            movies={movies}
            onYearFilter={handleYearFilter}
          />
          <button onClick={handleRandomMovie} style={overlayButton}>
            <Shuffle size={14} />
            {strings.controls.randomButton}
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          style={statsRow}
        >
          <StatsBar totalMovies={movies.length} totalMarkers={markers.length} />
        </motion.div>
      </div>

      {/* Side detail panel */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetailPanel
            key={selectedMovie.id}
            movie={selectedMovie}
            onClose={handleClosePanel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
