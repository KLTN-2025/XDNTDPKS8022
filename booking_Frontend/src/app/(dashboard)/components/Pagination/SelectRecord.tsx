import React from "react";

interface ILimitSelector {
  value: number;
  onChange: (value: number) => void;
}

const LimitSelector = ({ value, onChange }: ILimitSelector) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={`flex items-center gap-2 `}>
      <label
        htmlFor="limit-select"
        className="text-sm font-medium text-gray-700"
      >
        số lượng
      </label>
      <select
        id="limit-select"
        value={value}
        onChange={handleChange}
        className="px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        {[10, 20, 30, 40, 50].map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LimitSelector;
