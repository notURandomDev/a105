import { JX_COLOR, JXColor } from "@/constants/colors/theme";
import { View } from "@tarojs/components";
import { CSSProperties, ReactNode } from "react";

interface JXCardContainerProps {
  children: ReactNode;
  horizontal?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
  color?: JXColor;
  className?: string;
}

function JXCardContainer({
  children,
  horizontal = false,
  style,
  onClick,
  color = "gray",
  className,
}: JXCardContainerProps) {
  return (
    <View
      onClick={onClick}
      className={`${
        horizontal ? "container-h" : "container-v"
      } border ${className}`}
      style={{
        borderRadius: 16,
        padding: 16,
        borderColor: JX_COLOR[color].borderColor,
        gap: 5,
        backgroundColor: "#fff",
        boxShadow: `10px 10px 5px ${JX_COLOR[color].color}05`,
        ...style,
      }}
    >
      {children}
    </View>
  );
}

export default JXCardContainer;
