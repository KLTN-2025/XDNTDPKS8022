import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface CustomerBarChartProps {
  data: {
    months: string[];
    counts: number[];
  };
}
const CustomerBarChart = ({ data }: CustomerBarChartProps) => {
  const chartData = data.months.map((month, i) => ({
    month,
    customers: data.counts[i],
  }));

  return (
    <div className="bg-white p-4 rounded-2xl shadow hover:shadow-xl duration-300 mt-5">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => [`${value}`, "Khách hàng"]} />
          <Bar dataKey="customers" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomerBarChart;
