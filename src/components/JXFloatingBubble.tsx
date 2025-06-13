import { FloatingBubble } from "@taroify/core";
import React from "react";
import { Plus } from "@taroify/icons";

interface JXFloatingBubble {
  onClick: () => void;
}

function JXFloatingBubble({ onClick }) {
  return (
    <FloatingBubble
      style={{ backgroundColor: "black" }}
      axis="lock"
      icon={<Plus />}
      onClick={onClick}
    />
  );
}

export default JXFloatingBubble;
