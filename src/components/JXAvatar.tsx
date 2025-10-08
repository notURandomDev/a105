import { Image, View } from "@tarojs/components";

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

const JX_AVATAR_FONT_SIZE: Record<JXAvatarSize, number> = {
  md: 20,
  lg: 30,
  xl: 56,
};

interface JXAvatarProps {
  children: string;
  shape?: JXAvatarShape;
  size?: JXAvatarSize;
  src?: string;
}
function JXAvatar(props: JXAvatarProps) {
  const { children, shape = "circle", size = "md", src } = props;

  return (
    <View
      className="container-v"
      style={{
        width: JX_AVATAR_SIZE[size],
        height: JX_AVATAR_SIZE[size],
        borderRadius: JX_AVATAR_BORDER_RADIUS[shape],
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* <Text style={{ color: "white", fontSize: JX_AVATAR_FONT_SIZE[size] }}>
        {children ? children[0].toUpperCase() : "?"}
      </Text> */}
      <Image
        style={{ width: "100%", height: "100%" }}
        src={src ?? require("../assets/images/default-avatar.jpeg")}
        mode="aspectFill"
      />
    </View>
  );
}

export default JXAvatar;
