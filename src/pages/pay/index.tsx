import { View } from "@tarojs/components";
import "./index.scss";
import JXMetricCard from "@/components/Cards/JXMetricCard";

export default function Pay() {
  return (
    <View className="pay page page-padding">
      <View className="container-h card-gap">
        <JXMetricCard label={"已缴社费"} emoji={"💴"} value={50} />
        <JXMetricCard label={"认证情况"} emoji={"🟡"} value={"待认证"} />
      </View>
      <View className="container-v grow border"></View>
    </View>
  );
}
