import React from "react";

const SelectIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <mask
        id="select-icon-mask"
        width="17"
        height="17"
        x="4"
        y="4"
        fill="#000"
        maskUnits="userSpaceOnUse"
      >
        <path fill="#fff" d="M4 4h17v17H4z" />
        <path
          fillRule="evenodd"
          d="M19.294 12.063a1 1 0 0 0 .072-1.887l-13-5.107a1 1 0 0 0-1.297 1.297l5.107 13a1 1 0 0 0 1.887-.072l1.701-5.53z"
          clipRule="evenodd"
        />
      </mask>
      <path
        fill="currentColor"
        d="M19.294 12.063 19 11.107zm.072-1.887.365-.93zm-13-5.107.365-.93zM5.069 6.366l-.93.365zm5.107 13-.93.365zm1.887-.072L11.107 19zm1.701-5.53-.294-.955a1 1 0 0 0-.661.661zM19 11.107l.588 1.912a2 2 0 0 0 1.41-1.836zm0 0 1.999.076a2 2 0 0 0-1.268-1.937zM6 6l13 5.107.731-1.861-13-5.107zm0 0 .731-1.861a2 2 0 0 0-2.145.447zm0 0L4.586 4.586a2 2 0 0 0-.447 2.145zm5.107 13L6 6l-1.861.731 5.107 13zm0 0-1.861.731A2 2 0 0 0 11.183 21zm0 0 .076 1.999a2 2 0 0 0 1.836-1.41zm1.702-5.53L11.107 19l1.912.588 1.701-5.53zM19 11.107l-5.53 1.702.588 1.911 5.53-1.701z"
        mask="url(#select-icon-mask)"
      />
    </svg>
  );
};

export default SelectIcon;
