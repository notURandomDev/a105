import { BAND_GENRE_COLOR_MAP, BAND_GENRES } from "@/constants/utils/genre";
import JXChip from "./JXChip";
import { BandGenre } from "@/models/band";

interface JXGenreProps {
  genre: BandGenre;
}
function JXGenreChip({ genre }: JXGenreProps) {
  return (
    <JXChip color={BAND_GENRE_COLOR_MAP[BAND_GENRES[genre].group]}>
      {`${BAND_GENRES[genre].label}｜${genre}`}
    </JXChip>
  );
}

export default JXGenreChip;
