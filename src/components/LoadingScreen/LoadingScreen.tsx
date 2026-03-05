import ReelSpotPin from "../ReelSpotPin/ReelSpotPin";
import strings from "../../en.json";
import {
  loadingContainer,
  loadingIconStyle,
  gradientTitleLg,
  loadingErrorTitle,
  loadingErrorDetail,
  loadingSubLabel,
} from "../../theme";

interface LoadingScreenProps {
  error?: string | null;
}

export default function LoadingScreen({ error }: LoadingScreenProps) {
  return (
    <div style={loadingContainer}>
      <div style={loadingIconStyle(!!error)}>
        <ReelSpotPin size={32} />
      </div>

      {error ? (
        <>
          <p style={loadingErrorTitle}>{strings.loading.errorTitle}</p>
          <p style={loadingErrorDetail}>{error}</p>
        </>
      ) : (
        <>
          <p style={gradientTitleLg}>{strings.brand.appName}</p>
          <p style={loadingSubLabel}>{strings.loading.subtitle}</p>
        </>
      )}
    </div>
  );
}
