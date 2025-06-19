import { Genre, GenreGroup } from "@/models/genre";
import { JXColor } from "../colors/theme";

export interface GenreOption {
  label: string;
  emoji?: string;
  group: GenreGroup;
}

/**
 * 乐队音乐流派常量集合（带分组字段）
 * 每个风格明确标注所属的大类分组，便于直接查询
 */
export const GENRES: Record<Genre, GenreOption> = {
  // 主流流行风格（POP组）
  Pop: { label: "流行", emoji: "🎵", group: "POP" },
  Rock: { label: "摇滚", emoji: "🎸", group: "POP" },
  Alternative: { label: "另类摇滚", emoji: "🖤", group: "POP" },
  Indie: { label: "独立音乐", emoji: "📼", group: "POP" },

  // 重型/高能量风格（HEAVY组）
  HardRock: { label: "硬摇滚", emoji: "🤘", group: "HEAVY" },
  Punk: { label: "朋克", emoji: "💥", group: "HEAVY" },
  Metal: { label: "金属", emoji: "🔥", group: "HEAVY" },
  Grunge: { label: "垃圾摇滚", emoji: "🧢", group: "HEAVY" },

  // 爵士/灵魂/节奏类（JAZZ_SOUL组）
  Jazz: { label: "爵士", emoji: "🎷", group: "JAZZ_SOUL" },
  Funk: { label: "放克", emoji: "🕺", group: "JAZZ_SOUL" },
  Soul: { label: "灵魂乐", emoji: "✨", group: "JAZZ_SOUL" },
  "R&B": { label: "节奏布鲁斯", emoji: "🎶", group: "JAZZ_SOUL" },
  Blues: { label: "布鲁斯", emoji: "🎵", group: "JAZZ_SOUL" },

  // 古典/实验性（EXPERIMENTAL组）
  Classical: { label: "古典", emoji: "🎻", group: "EXPERIMENTAL" },
  Experimental: { label: "实验音乐", emoji: "🧪", group: "EXPERIMENTAL" },
  Fusion: { label: "融合风格", emoji: "⚡", group: "EXPERIMENTAL" },

  // 电子/合成器（ELECTRONIC组）
  Electronic: { label: "电子乐", emoji: "🔊", group: "ELECTRONIC" },
  Synthpop: { label: "合成器流行", emoji: "💿", group: "ELECTRONIC" },
  Ambient: { label: "氛围音乐", emoji: "☁️", group: "ELECTRONIC" },
  EDM: { label: "电子舞曲", emoji: "🪩", group: "ELECTRONIC" },
  LoFi: { label: "低传真", emoji: "🎧", group: "ELECTRONIC" },

  // 民谣/地域风格（WORLD组）
  Folk: { label: "民谣", emoji: "🌿", group: "WORLD" },
  Reggae: { label: "雷鬼", emoji: "🌴", group: "WORLD" },
  Latin: { label: "拉丁", emoji: "💃", group: "WORLD" },

  // 现代都市（URBAN组）
  HipHop: { label: "嘻哈", emoji: "🎤", group: "URBAN" },
} as const;

export const POP_GENRES = GENRES;

export const GENRE_COLOR_MAP: Record<GenreGroup, JXColor> = {
  POP: "yellow",
  HEAVY: "pink",
  JAZZ_SOUL: "purple",
  ELECTRONIC: "purple",
  EXPERIMENTAL: "blue",
  WORLD: "green",
  URBAN: "blue",
};
