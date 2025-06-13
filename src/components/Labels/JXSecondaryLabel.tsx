import { Text } from "@tarojs/components";
import React from "react";

function JXSecondaryLabel({ children }: { children?: string }) {
  return <Text style={{ fontSize: 12, color: "#94989b" }}>{children}</Text>;
}

export default JXSecondaryLabel;
