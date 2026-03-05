interface ReelSpotPinProps {
  size?: number;
}

export default function ReelSpotPin({ size = 22 }: ReelSpotPinProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.686 2 6 4.686 6 8c0 4.418 2.25 8.418 4.5 11.5C12.75 22.5 13.5 22 13.5 22S18 14.5 18 8c0-3.314-2.686-6-6-6z"
        fill="#22c55e"
      />
      <circle cx="12" cy="8.5" r="2.2" fill="#0f0f18" />
    </svg>
  );
}
