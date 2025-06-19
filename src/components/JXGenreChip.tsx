import { GENRE_COLOR_MAP, GENRES } from "@/constants/utils/genre";
import JXChip from "./JXChip";
import { Genre } from "@/models/genre";

interface JXGenreProps {
  genre: Genre;
  active?: boolean;
}
function JXGenreChip({ genre, active = true }: JXGenreProps) {
  return (
    <JXChip color={active ? GENRE_COLOR_MAP[GENRES[genre].group] : "gray"}>
      {`${GENRES[genre].label}｜${genre}`}
    </JXChip>
  );
}

export default JXGenreChip;
