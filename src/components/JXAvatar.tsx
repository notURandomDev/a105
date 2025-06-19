import { Text, View } from "@tarojs/components";

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
}
function JXAvatar({ children, shape = "circle", size = "md" }: JXAvatarProps) {
  return (
    <View
      className="container-v"
      style={{
        backgroundColor: "#000",
        width: JX_AVATAR_SIZE[size],
        height: JX_AVATAR_SIZE[size],
        borderRadius: JX_AVATAR_BORDER_RADIUS[shape],
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: JX_AVATAR_FONT_SIZE[size] }}>
        {children ? children[0].toUpperCase() : "?"}
      </Text>
    </View>
  );
}

export default JXAvatar;
