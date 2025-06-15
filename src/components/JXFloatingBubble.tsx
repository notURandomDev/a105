import { FloatingBubble } from "@taroify/core";
import { FloatingBubbleOffset } from "@taroify/core/floating-bubble/floating-bubble.shared";
import { Plus } from "@taroify/icons";

interface JXFloatingBubbleProps {
  onClick?: () => void;
  offset?: FloatingBubbleOffset;
}

function JXFloatingBubble({
  onClick,
  offset = { x: -1, y: -1 },
}: JXFloatingBubbleProps) {
  return (
    <FloatingBubble
      offset={offset}
      magnetic="x"
      axis="xy"
      style={{ backgroundColor: "black" }}
      icon={<Plus />}
      onClick={onClick}
    />
  );
}

export default JXFloatingBubble;
