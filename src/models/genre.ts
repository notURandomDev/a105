export type Genre =
  // 主流流行风格
  | "Pop" // 流行乐（如 Taylor Swift、Billie Eilish）
  | "Rock" // 摇滚（经典风格，如 The Beatles、Queen）
  | "Alternative" // 另类摇滚（如 Radiohead、Arcade Fire）
  | "Indie" // 独立音乐（非主流厂牌，如 Tame Impala）

  // 重型/高能量风格
  | "HardRock" // 硬摇滚（如 AC/DC、Guns N' Roses）
  | "Punk" // 朋克（如 The Clash、Green Day）
  | "Metal" // 金属（如 Metallica、Iron Maiden）
  | "Grunge" // 垃圾摇滚（如 Nirvana、Pearl Jam）

  // 爵士/灵魂/节奏类
  | "Jazz" // 爵士（如 Miles Davis、John Coltrane）
  | "Funk" // 放克（节奏驱动，如 James Brown、Prince）
  | "Soul" // 灵魂乐（如 Aretha Franklin、Marvin Gaye）
  | "R&B" // 节奏布鲁斯（现代变种，如 Beyoncé、The Weeknd）

  // 古典/实验性
  | "Classical" // 古典（器乐为主，如交响乐、室内乐）
  | "Experimental" // 实验音乐（先锋派，如 Björk）
  | "Fusion" // 融合风格（如爵士摇滚融合）

  // 电子/合成器
  | "Electronic" // 电子乐（广义，如 Daft Punk）
  | "Synthpop" // 合成器流行（如 Depeche Mode、The Weeknd）
  | "Ambient" // 氛围音乐（如 Brian Eno）

  // 民谣/地域风格
  | "Folk" // 民谣（如 Bob Dylan、Joni Mitchell）
  | "Reggae" // 雷鬼（牙买加风格，如 Bob Marley）
  | "Latin" // 拉丁音乐（如 Shakira）
  | "Blues" // 布鲁斯（根源风格，如 B.B. King）

  // 现代都市/舞曲
  | "HipHop" // 嘻哈（如 Kendrick Lamar）
  | "EDM" // 电子舞曲（如 Martin Garrix）
  | "LoFi"; // 低传真音乐（放松/学习场景）

/**
 * 乐队音乐流派分组键（显式联合类型）
 */
export type GenreGroup =
  | "POP" // 流行与摇滚
  | "HEAVY" // 重型音乐
  | "JAZZ_SOUL" // 爵士与节奏
  | "ELECTRONIC" // 电子与合成
  | "EXPERIMENTAL" // 古典与实验
  | "WORLD" // 地域与文化
  | "URBAN"; // 现代都市
