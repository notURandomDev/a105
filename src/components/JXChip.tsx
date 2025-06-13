import { JX_COLOR, JXColor } from "@/constants/colors/theme";
import { Text, View } from "@tarojs/components";

interface JXChipProps {
  children: string;
  color?: JXColor;
}
function JXChip({ children, color = "gray" }: JXChipProps) {
  return (
    <View
      className="container-h"
      style={{
        borderRadius: 4,
        alignItems: "center",
        padding: "2px 4px",
        ...JX_COLOR[color],
      }}
    >
      <Text style={{ fontSize: 10, padding: "0 2px" }}>{children}</Text>
    </View>
  );
}

export default JXChip;
