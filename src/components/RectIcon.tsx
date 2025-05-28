interface RectIconProps {
  color: string;
}

const RectIcon = ({ color }: RectIconProps) => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        fill={color}
        fillRule="evenodd"
        d="M18 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1M6 4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default RectIcon;
