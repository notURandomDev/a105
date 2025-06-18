import { BAND_GENRE_COLOR_MAP, BAND_GENRES } from "@/constants/utils/genre";
import JXChip from "./JXChip";
import { BandGenre } from "@/models/band";

interface JXGenreProps {
  genre: BandGenre;
  active?: boolean;
}
function JXGenreChip({ genre, active = true }: JXGenreProps) {
  return (
    <JXChip
      color={active ? BAND_GENRE_COLOR_MAP[BAND_GENRES[genre].group] : "gray"}
    >
      {`${BAND_GENRES[genre].label}｜${genre}`}
    </JXChip>
  );
}

export default JXGenreChip;
