import { Text } from "@tarojs/components";

interface JXTitleLabelProps {
  children: string;
  color?: "black" | "white";
}
function JXTitleLabel({ children, color = "black" }: JXTitleLabelProps) {
  return (
    <Text style={{ fontSize: 16, fontWeight: 600, color }}>{children}</Text>
  );
}

export default JXTitleLabel;
