/* eslint-disable @typescript-eslint/no-explicit-any */
import type { CSSProperties, FC, ReactNode } from "react";

type SideBarProps = {
  className?: string;
  children?: ReactNode;
};

type HeaderProps = {
  content: any;
  className?: string;
  type?: string;
  style?: CSSProperties;
};

type SpaceProps = {
  className?: string;
};

interface SideBarComponent extends FC<SideBarProps> {
  Header: FC<HeaderProps>;
  SpaceBar: FC<SpaceProps>;
  Content: FC<any>;
}

const Header: FC<HeaderProps> = ({ content, type, className = "", style }) => {
  if (type === "big") return <h2 className={className} style={style}>{content}</h2>;
  else if (type === "medium") return <h3 className={className} style={style}>{content}</h3>;
  else return <h5 className={className} style={style}>{content}</h5>;
};

const SpaceBar: FC<SpaceProps> = ({ className = "" }) => {
  return <div className={`sidebarBase ${className}`}></div>;
};

const SideBar: SideBarComponent = ({ className = "", children }) => {
  return <div className={className}>{children}</div>;
};

const Content: FC<any> = ({ children, className = "" ,style}) => {
  return <div style={style} className={className}>{children}</div>;
};

SideBar.Header = Header;
SideBar.SpaceBar = SpaceBar;
SideBar.Content = Content;

export default SideBar;
