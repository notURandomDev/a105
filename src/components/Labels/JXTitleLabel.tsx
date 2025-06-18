import { Text } from "@tarojs/components";

interface JXTitleLabelProps {
  children: string;
  color?: "black" | "white";
}
function JXTitleLabel({ children, color = "black" }: JXTitleLabelProps) {
  return (
    <Text style={{ fontSize: 18, fontWeight: 600, color }}>{children}</Text>
  );
}

export default JXTitleLabel;
