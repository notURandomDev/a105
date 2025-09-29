import { Button } from "@taroify/core";
import { ITouchEvent } from "@tarojs/components";
import { ReactNode } from "react";

interface JXButtonProps {
  children: ReactNode;
  onClick?: (event: ITouchEvent) => void;
  variant?: "solid" | "outlined";
  disabled?: boolean;
  fullWidth?: boolean;
}

function JXButton({
  children,
  onClick,
  variant = "solid",
  disabled = false,
  fullWidth = false,
}: JXButtonProps) {
  const isSolid = variant === "solid";

  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      style={{
        borderColor: isSolid ? "#fff" : "#11181C",
        backgroundColor: isSolid ? "#11181C" : "#f7f8fa",
        color: isSolid ? "#fff" : "#11181C",
        padding: "10px 20px",
        height: "auto",
        fontWeight: 500,
        borderRadius: 8,
        width: fullWidth ? "100%" : undefined,
      }}
    >
      {children}
    </Button>
  );
}

export default JXButton;
