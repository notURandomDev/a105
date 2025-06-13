import { Avatar } from "@taroify/core";
import { AvatarShape, AvatarSize } from "@taroify/core/avatar/avatar.shared";

interface JXAvatarProps {
  children: string | null | undefined;
  size?: AvatarSize;
  shape?: AvatarShape;
}
function JXAvatar({
  children,
  size = "medium",
  shape = "circle",
}: JXAvatarProps) {
  return (
    <Avatar size={size} shape={shape} style={{ backgroundColor: "black" }}>
      {children ? children[0].toUpperCase() : "?"}
    </Avatar>
  );
}

export default JXAvatar;
