import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface IEmployeeChartData {
  time: string;
  value: number;
}

export default function SensorTrendChart({ data }: { data: IEmployeeChartData[] }) {
  const dataChart = data.map((item) => ({
    time: item.time,
    value: Number(item?.value ?? 0).toFixed(2),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={dataChart}>
        <defs>
          <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5CE191" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#5CE191" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="time"
          axisLine={{ stroke: "#e0e0e0" }}
          tickLine={{ stroke: "#e0e0e0" }}
          interval="preserveStartEnd"
          minTickGap={20}
          dy={10}
        />

        <YAxis
          axisLine={{ stroke: "#e0e0e0" }}
          tickLine={{ stroke: "#e0e0e0" }}
        />

        <Tooltip />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#5CE191"
          fill="url(#moistureGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}