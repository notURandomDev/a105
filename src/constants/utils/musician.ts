export type MusicianType =
  | "vocalist"
  | "guitarist"
  | "bassist"
  | "keyboardist"
  | "drummer";

type MusicianDisplayConfig = {
  label: string;
  emoji: string;
};
export const MUSICIAN_DISPLAY: Record<MusicianType, MusicianDisplayConfig> = {
  vocalist: {
    label: "主唱",
    emoji: "🎤",
  },
  guitarist: {
    label: "吉他手",
    emoji: "🎸",
  },
  bassist: {
    label: "贝斯手",
    emoji: "🎛️",
  },
  keyboardist: {
    label: "键盘手",
    emoji: "🎹",
  },
  drummer: {
    label: "鼓手",
    emoji: "🥁",
  },
};
