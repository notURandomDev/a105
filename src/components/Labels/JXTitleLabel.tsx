import { Text } from "@tarojs/components";

interface JXTitleLabelProps {
  children: string | number;
  color?: "black" | "white";
  lg?: boolean;
}
function JXTitleLabel({
  children,
  color = "black",
  lg = false,
}: JXTitleLabelProps) {
  return (
    <Text style={{ fontSize: lg ? 20 : 18, fontWeight: 600, color }}>
      {children}
    </Text>
  );
}

export default JXTitleLabel;
