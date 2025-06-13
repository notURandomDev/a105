import { Text, View } from "@tarojs/components";

function JXFormLabel({ children }: { children: string }) {
  return (
    <View style={{ padding: "16px 16px 8px" }}>
      <Text style={{ color: "#969799", fontSize: "14px" }}>{children}</Text>
    </View>
  );
}

export default JXFormLabel;
