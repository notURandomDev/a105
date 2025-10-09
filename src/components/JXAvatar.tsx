import { Button, CommonEventFunction, Image } from "@tarojs/components";

type JXAvatarShape = "circle" | "rounded";

const JX_AVATAR_BORDER_RADIUS: Record<JXAvatarShape, number> = {
  circle: 100,
  rounded: 16,
};

type JXAvatarSize = "md" | "lg" | "xl";

const JX_AVATAR_SIZE: Record<JXAvatarSize, number> = {
  md: 45,
  lg: 80,
  xl: 125,
};

interface JXAvatarProps {
  shape?: JXAvatarShape;
  size?: JXAvatarSize;
  src?: string;
  clickable?: boolean;
  onChooseAvatar?: CommonEventFunction;
}

function JXAvatar(props: JXAvatarProps) {
  const { shape = "circle", size = "md", src, clickable = false } = props;

  return (
    <Button
      disabled={!clickable}
      className="no-border-after"
      openType="chooseAvatar"
      onChooseAvatar={props.onChooseAvatar}
      style={{
        backgroundColor: "transparent",
        borderColor: "transparent",
        padding: 0,
        margin: 0,
        height: JX_AVATAR_SIZE[size],
        width: JX_AVATAR_SIZE[size],
      }}
    >
      <Image
        style={{
          width: JX_AVATAR_SIZE[size],
          height: JX_AVATAR_SIZE[size],
          borderRadius: JX_AVATAR_BORDER_RADIUS[shape],
        }}
        src={src ?? require("../assets/images/default-avatar.jpeg")}
        mode="aspectFill"
      />
    </Button>
  );
}

export default JXAvatar;
