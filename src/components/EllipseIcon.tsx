interface EllipseIcon {
  color: string;
}

const EllipseIcon = ({ color } : EllipseIcon) => {
  return (
    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path
        fill={color}
        fill-rule="evenodd"
        d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16m0 1a9 9 0 1 0 0-18 9 9 0 0 0 0 18"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
};

export default EllipseIcon;
