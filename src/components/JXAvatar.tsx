import { Avatar } from "@taroify/core";
import { AvatarShape, AvatarSize } from "@taroify/core/avatar/avatar.shared";
import { CSSProperties } from "react";

interface JXAvatarProps {
  children: string | null | undefined;
  size?: AvatarSize;
  shape?: AvatarShape;
  style?: CSSProperties;
}
function JXAvatar({
  children,
  size = "medium",
  shape = "circle",
  style,
}: JXAvatarProps) {
  return (
    <Avatar
      size={size}
      shape={shape}
      style={{ backgroundColor: "black", ...style }}
    >
      {children ? children[0].toUpperCase() : "?"}
    </Avatar>
  );
}

export default JXAvatar;
