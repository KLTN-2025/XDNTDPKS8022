import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface RevenueTotalMonthProps {
  data: { months: string[]; data: number[] };
}
const RevenueTotalMonth: React.FC<RevenueTotalMonthProps> = ({ data }) => {
  const charData = data.months.map((month, index) => ({
    months: month,
    data: data.data[index] || 0, // Ensure we have a value for each month
  }));

  return (
    <div className="bg-white shadow-xl hover:shadow-2xl duration-300 rounded-2xl mt-5 p-4">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={charData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="months" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="data"
            stroke="#FFA500"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueTotalMonth;
