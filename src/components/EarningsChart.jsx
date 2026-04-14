import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const EarningsChart = ({ data }) => {
  return (
    <div className="card p-3 shadow-sm h-100">
      <h5 className="fw-semibold mb-3">Earnings Overview</h5>

      {data.length === 0 ? (
        <div>
          <span className="text-muted fw-semibold">No Data Available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="earnings"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EarningsChart;
