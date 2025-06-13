import { View } from "@tarojs/components";
import { CSSProperties, ReactNode } from "react";

interface JXCardContainerProps {
  children: ReactNode;
  horizontal?: boolean;
  style?: CSSProperties;
  onClick?: () => void;
}

function JXCardContainer({
  children,
  horizontal = false,
  style,
  onClick,
}: JXCardContainerProps) {
  return (
    <View
      onClick={onClick}
      className={`${horizontal ? "container-h" : "container-v"} border`}
      style={{
        borderRadius: 16,
        padding: 16,
        borderColor: "#eceeed",
        gap: 4,
        backgroundColor: "#fff",
        boxShadow: "10px 10px 5px #f9fafe",
        ...style,
      }}
    >
      {children}
    </View>
  );
}

export default JXCardContainer;
