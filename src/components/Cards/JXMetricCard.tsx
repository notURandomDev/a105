import JXCardContainer from "../JXCardContainer";
import { Text, View } from "@tarojs/components";
import JXEmoji from "../JXEmoji";
import JXBodyLabel from "../Labels/JXBodyLabel";

interface JXMetricCardProps {
  label?: string;
  value?: string | number;
  emoji?: string;
  active?: boolean;
  onClick?: () => void;
}
function JXMetricCard({
  label = "标题",
  value = 0,
  emoji = "⭐️",
  active = false,
  onClick,
}: JXMetricCardProps) {
  return (
    <JXCardContainer
      onClick={onClick}
      color={active ? "black" : "gray"}
      className="grow"
      horizontal
      style={{ alignItems: "center" }}
    >
      <View className="container-v grow">
        <JXBodyLabel size="lg">{label}</JXBodyLabel>
        <Text style={{ fontWeight: 600, fontSize: 28 }}>{value}</Text>
      </View>
      <View className="container-v">
        <JXEmoji size="xl">{emoji}</JXEmoji>
      </View>
    </JXCardContainer>
  );
}

export default JXMetricCard;
