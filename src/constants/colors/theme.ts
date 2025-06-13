import { CSSProperties } from "react";

export type JXColor = "blue" | "yellow" | "green" | "gray";

export const JX_COLOR: Record<JXColor, CSSProperties> = {
  blue: { backgroundColor: "#e6f1fe", color: "#006FEE" },
  green: { backgroundColor: "#e8faf0", color: "#12a150" },
  yellow: { backgroundColor: "#fefce8", color: "#f5a524" },
  gray: { backgroundColor: "#f4f4f5", color: "#71717A" },
};
