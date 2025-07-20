import { View } from "@tarojs/components";
import "./index.scss";
import JXMetricCard from "@/components/Cards/JXMetricCard";

export default function Pay() {
  return (
    <View className="pay page page-padding">
      <JXMetricCard label={"已缴社费"} emoji={"💴"} value={50} />
      <View className="container-v grow border"></View>
    </View>
  );
}
