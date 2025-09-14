import { PositionType } from "@/models/position";

export type MusicianDisplayConfig = {
  label: string;
  emoji: string;
};

export const MUSICIAN_DISPLAY_CONFIG: Record<
  PositionType,
  MusicianDisplayConfig
> = {
  vocalist: {
    label: "主唱",
    emoji: "🎤",
  },
  guitarist_lead: {
    label: "主音吉他手",
    emoji: "🎸",
  },
  guitarist_rhythm: {
    label: "节奏吉他手",
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
} as const;

// 乐队界面
