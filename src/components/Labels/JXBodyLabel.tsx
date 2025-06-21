import { Text } from "@tarojs/components";

type JXBodyLabelSize = "md" | "lg";

const JX_BODY_LABEL_FONT_SIZE: Record<JXBodyLabelSize, number> = {
  md: 12,
  lg: 14,
};

interface JXBodyLabelProps {
  children?: string;
  size?: JXBodyLabelSize;
}

function JXBodyLabel({ children, size = "md" }: JXBodyLabelProps) {
  return (
    <Text style={{ fontSize: JX_BODY_LABEL_FONT_SIZE[size] }}>{children}</Text>
  );
}

export default JXBodyLabel;
