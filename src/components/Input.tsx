import React from "react";

interface NumberInputProps {
  value: number;
  onChange: (value: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
}

const Input: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
}) => {

  return (
    <input
      className="number-input"
      type="number"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
    />
  );
};

export default Input;
