import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataPoint {
  name: string;
  online: number;
  offline: number;
}
interface BookingResourceChartProps {
  data: DataPoint[] | null;
}

const BookingResourceChart = ({ data }: BookingResourceChartProps) => {
  const chartData = useMemo(() => data || [], [data]);
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-4 rounded-2xl shadow hover:shadow-xl duration-300 mt-5">
        <p className="text-center text-gray-500">
          Không có dữ liệu để hiển thị
        </p>
      </div>
    );
  }
  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-xl duration-300 mt-10">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === "online") return [value, "Đặt online"];
              if (name === "offline") return [value, "Đặt offline"];
              return [value, name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="online"
            stroke="#8884d8"
            strokeDasharray="5 5"
            strokeWidth={2}
          />
          <Line
            type="monotone"
            dataKey="offline"
            stroke="#82ca9d"
            strokeWidth={2}
            strokeDasharray="3 4 5 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BookingResourceChart;
