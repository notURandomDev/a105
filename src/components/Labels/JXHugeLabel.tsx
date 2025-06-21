import { Text, View } from "@tarojs/components";

interface JXHugeLabelProps {
  children?: string;
}

function JXHugeLabel({ children }: JXHugeLabelProps) {
  return (
    <View style={{ padding: "16px 0" }}>
      <Text style={{ fontWeight: 600, fontSize: 40 }}>{children}</Text>
    </View>
  );
}

export default JXHugeLabel;
