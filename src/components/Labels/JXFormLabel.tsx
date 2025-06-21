import { Text, View } from "@tarojs/components";

interface JXFormLabelProps {
  children: string;
  px?: boolean;
}

function JXFormLabel({ children, px = false }: JXFormLabelProps) {
  return (
    <View style={{ padding: `16px ${px ? 16 : 0}px` }}>
      <Text style={{ color: "#969799", fontSize: "14px" }}>{children}</Text>
    </View>
  );
}

export default JXFormLabel;
