import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type { Movie } from "../../types";
import { colors, detailPanelShell, panelCloseBtn } from "../../theme";
import PanelHeader from "./PanelHeader";
import CreditsBlock from "./CreditsBlock";
import LocationsSection from "./LocationsSection";

interface MovieDetailPanelProps {
  movie: Movie | null;
  onClose: () => void;
}

export default function MovieDetailPanel({
  movie,
  onClose,
}: MovieDetailPanelProps) {
  return (
    <AnimatePresence>
      {movie && (
        <motion.div
          key={movie.id}
          initial={{ x: 380, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 380, opacity: 0 }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          style={detailPanelShell}
        >
          <button onClick={onClose} style={panelCloseBtn}>
            <X size={14} color={colors.textSec} />
          </button>

          <PanelHeader title={movie.title} releaseYear={movie.releaseYear} />

          <CreditsBlock
            director={movie.director}
            actors={movie.actors}
            productionCompany={movie.productionCompany}
          />

          <LocationsSection locations={movie.locations} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
