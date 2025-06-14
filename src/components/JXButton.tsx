import { Button } from "@taroify/core";
import { ReactNode } from "react";

interface JXButtonProps {
  children: ReactNode;
}

function JXButton({ children }: JXButtonProps) {
  return (
    <Button
      style={{
        backgroundColor: "#11181C",
        color: "#fff",
        padding: "10px 20px",
        height: "auto",
        fontWeight: 500,
        borderRadius: 8,
      }}
    >
      {children}
    </Button>
  );
}

export default JXButton;
