import { CSSProperties } from "react";

export type JXColor =
  | "blue"
  | "yellow"
  | "green"
  | "gray"
  | "black"
  | "purple"
  | "pink";

export const JX_COLOR: Record<JXColor, CSSProperties> = {
  blue: {
    backgroundColor: "#e6f1fe",
    color: "#006FEE",
    borderColor: "#e6f1fe",
  },
  green: {
    backgroundColor: "#e8faf0",
    color: "#12a150",
    borderColor: "#e8faf0",
  },
  yellow: {
    backgroundColor: "#fefce8",
    color: "#f5a524",
    borderColor: "#fefce8",
  },
  gray: {
    backgroundColor: "#e4e4e7",
    color: "#71717A",
    borderColor: "#e4e4e7",
  },
  black: {
    backgroundColor: "#3f3f46",
    color: "#71717A",
    borderColor: "#3f3f46",
  },
  purple: {
    backgroundColor: "#f2eafa",
    color: "#7828c8",
    borderColor: "#f2eafa",
  },
  pink: {
    backgroundColor: "#fee7ef",
    color: "#f31260",
    borderColor: "#fee7ef",
  },
};
