import { FloatingBubble } from "@taroify/core";
import { Plus } from "@taroify/icons";

interface JXFloatingBubble {
  onClick: () => void;
}

function JXFloatingBubble({ onClick }) {
  return (
    <FloatingBubble
      offset={{ x: -1, y: 450 }}
      magnetic="x"
      axis="xy"
      style={{ backgroundColor: "black" }}
      icon={<Plus />}
      onClick={onClick}
    />
  );
}

export default JXFloatingBubble;
