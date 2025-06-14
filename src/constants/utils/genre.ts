import { BandGenre } from "@/models/band";

export interface BandGenreOption {
  value: BandGenre;
  label: string;
  category: string;
}

/**
 * 乐队音乐流派常量集合
 * 包含主流音乐风格定义，用于UI展示、筛选或分类
 * 注：emoji 仅作视觉辅助，实际使用时可根据需求移除
 */
export const BAND_GENRES: Record<BandGenre, { label: string; emoji?: string }> =
  {
    // 主流流行风格
    Pop: { label: "流行", emoji: "🎵" }, // Taylor Swift, Ariana Grande
    Rock: { label: "摇滚", emoji: "🎸" }, // The Rolling Stones
    Alternative: { label: "另类摇滚", emoji: "🖤" }, // Radiohead
    Indie: { label: "独立音乐", emoji: "📼" }, // Tame Impala

    // 重型/高能量风格
    HardRock: { label: "硬摇滚", emoji: "🤘" }, // AC/DC
    Punk: { label: "朋克", emoji: "💥" }, // The Clash
    Metal: { label: "金属", emoji: "🔥" }, // Metallica
    Grunge: { label: "垃圾摇滚", emoji: "🧢" }, // Nirvana

    // 爵士/灵魂/节奏类
    Jazz: { label: "爵士", emoji: "🎷" }, // Miles Davis
    Funk: { label: "放克", emoji: "🕺" }, // James Brown
    Soul: { label: "灵魂乐", emoji: "✨" }, // Aretha Franklin
    "R&B": { label: "节奏布鲁斯", emoji: "🎶" }, // Beyoncé

    // 古典/实验性
    Classical: { label: "古典", emoji: "🎻" }, // Beethoven
    Experimental: { label: "实验音乐", emoji: "🧪" }, // Björk
    Fusion: { label: "融合风格", emoji: "⚡" }, // Jazz + Rock

    // 电子/合成器
    Electronic: { label: "电子乐", emoji: "🔊" }, // Daft Punk
    Synthpop: { label: "合成器流行", emoji: "💿" }, // The Weeknd
    Ambient: { label: "氛围音乐", emoji: "☁️" }, // Brian Eno

    // 民谣/地域风格
    Folk: { label: "民谣", emoji: "🌿" }, // Bob Dylan
    Reggae: { label: "雷鬼", emoji: "🌴" }, // Bob Marley
    Latin: { label: "拉丁", emoji: "💃" }, // Shakira
    Blues: { label: "布鲁斯", emoji: "🎵" }, // B.B. King

    // 现代都市/舞曲
    HipHop: { label: "嘻哈", emoji: "🎤" }, // Kendrick Lamar
    EDM: { label: "电子舞曲", emoji: "🪩" }, // Martin Garrix
    LoFi: { label: "低传真", emoji: "🎧" }, // 学习/放松场景
  } as const;
