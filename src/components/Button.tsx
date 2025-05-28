import type { ReactNode, FC } from "react";

type ButtonProps = {
  children: ReactNode;
  type?: "primary" | "default";
  onClick?: () => void;
  className?: string;
};

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return <button className={`button ${className}`} onClick={onClick}>{children}</button>;
};

export default Button;
