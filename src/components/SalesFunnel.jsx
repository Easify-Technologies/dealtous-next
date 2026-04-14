import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  YAxis,
} from "recharts";

const SalesFunnel = ({ products, orders, sales }) => {
  const data = [
    { name: "Products", value: products },
    { name: "Orders", value: orders },
    { name: "Sales", value: sales },
  ];

  return (
    <div className="card p-3 shadow-sm h-100">
      <h5 className="fw-semibold mb-3">Sales Funnel</h5>

      {data.length === 0 ? (
        <div>
          <span className="text-muted fw-semibold">No Data Available</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesFunnel;
