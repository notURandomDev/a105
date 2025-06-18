import JXCardContainer from "../JXCardContainer";
import { Text, View } from "@tarojs/components";

interface JXMetricCardProps {
  label?: string;
  value?: string | number;
  emoji?: string;
  active?: boolean;
}
function JXMetricCard({
  label = "标题",
  value = 0,
  emoji = "⭐️",
  active = false,
}: JXMetricCardProps) {
  return (
    <JXCardContainer
      color={active ? "black" : "gray"}
      className="grow"
      horizontal
      style={{ alignItems: "center" }}
    >
      <View className="container-v grow">
        <Text style={{ fontSize: 14 }}>{label}</Text>
        <Text style={{ fontWeight: 600, fontSize: 28 }}>{value}</Text>
      </View>
      <View className="container-v">
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
      </View>
    </JXCardContainer>
  );
}

export default JXMetricCard;
