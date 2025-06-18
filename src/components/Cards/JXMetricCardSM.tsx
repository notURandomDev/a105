import JXCardContainer from "../JXCardContainer";
import { Text, View } from "@tarojs/components";

interface JXMetricCardSMProps {
  label?: string;
  value?: string | number;
  emoji?: string;
  active?: boolean;
}
function JXMetricCardSM({
  label = "标题",
  value = 0,
  emoji = "⭐️",
  active = false,
}: JXMetricCardSMProps) {
  return (
    <JXCardContainer color={active ? "black" : "gray"} className="grow">
      <View
        className="container-h grow"
        style={{ alignItems: "center", gap: 12 }}
      >
        <Text style={{ fontSize: 24 }}>{emoji}</Text>
        <Text style={{ fontWeight: 600, fontSize: 28 }}>{value}</Text>
      </View>
      <View className="container-v">
        <Text style={{ fontSize: 14 }}>{label}</Text>
      </View>
    </JXCardContainer>
  );
}

export default JXMetricCardSM;
