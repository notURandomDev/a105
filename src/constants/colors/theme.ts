import { CSSProperties } from "react";

export type JXColor = "blue" | "yellow" | "green" | "gray" | "black";

export const JX_COLOR: Record<JXColor, CSSProperties> = {
  blue: { backgroundColor: "#e6f1fe", color: "#006FEE" },
  green: { backgroundColor: "#e8faf0", color: "#12a150" },
  yellow: { backgroundColor: "#fefce8", color: "#f5a524" },
  gray: { backgroundColor: "#e4e4e7", color: "#71717A" },
  black: { backgroundColor: "#3f3f46", color: "#71717A" },
};
