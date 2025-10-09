import { IconNode } from "lucide";
import JXCardContainer from "./JXCardContainer";
import { JXIcon } from "./JXIcon";
import { View } from "@tarojs/components";
import { CSSProperties } from "react";

interface JXActionButtonProps {
  icon: IconNode;
  color?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const AbsoluteStyle: CSSProperties = {
  position: "absolute",
  bottom: 0,
  right: 0,
  left: 0,
  top: 0,
};

const JXActionButton = (props: JXActionButtonProps) => {
  const { icon, color, onClick, disabled = false } = props;
  return (
    <JXCardContainer
      onClick={disabled ? () => {} : onClick}
      horizontal
      style={{ borderRadius: 50, position: "relative" }}
    >
      <JXIcon icon={icon} color={color} />
      {disabled && (
        <>
          {/* 灰色遮罩 */}
          <View
            className="cc container-h"
            style={{
              ...AbsoluteStyle,
              borderRadius: 50,
              backgroundColor: "#ffffff",
              opacity: 0.8,
            }}
          />
          {/* 禁用斜杠 */}
          <View
            style={{
              ...AbsoluteStyle,
              borderTop: "1px #e4e4e7 solid",
              transform: "rotate(45deg) translateX(-0px) translateY(28px)",
            }}
          />
        </>
      )}
    </JXCardContainer>
  );
};

export default JXActionButton;
