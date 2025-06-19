import { Text } from "@tarojs/components";

type JXEmojiSize = "xs" | "sm" | "md" | "lg" | "xl";
const JX_EMOJI_SIZE: Record<JXEmojiSize, number> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
};

interface JXEmojiProps {
  children: string;
  size?: JXEmojiSize;
}

function JXEmoji({ children, size = "md" }: JXEmojiProps) {
  return <Text style={{ fontSize: JX_EMOJI_SIZE[size] }}>{children}</Text>;
}

export default JXEmoji;
