"use client";

import {
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  AreaChart as ReAreaChart,
  Area,
} from "recharts";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'];

export function PieChartCard({ data, dataKey, nameKey }: { data: Record<string, string | number>[], dataKey: string, nameKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
        <Legend wrapperStyle={{ color: '#d1d5db' }} />
      </RePieChart>
    </ResponsiveContainer>
  );
}

export function DonutChartCard({ data, dataKey, nameKey }: { data: Record<string, string | number>[], dataKey: string, nameKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          fill="#82ca9d"
          dataKey={dataKey}
          nameKey={nameKey}
          paddingAngle={5}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f3f4f6' }} />
        <Legend wrapperStyle={{ color: '#d1d5db' }} />
      </RePieChart>
    </ResponsiveContainer>
  );
}

export function BarChartCard({ data, dataKey, xAxisKey }: { data: Record<string, string | number>[], dataKey: string, xAxisKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
        <Legend wrapperStyle={{ color: '#475569' }} />
        <Bar dataKey={dataKey} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
      </ReBarChart>
    </ResponsiveContainer>
  );
}

export function LineChartCard({ data, dataKey1, dataKey2, xAxisKey }: { data: Record<string, string | number>[], dataKey1: string, dataKey2?: string, xAxisKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey={xAxisKey} stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
        <Legend wrapperStyle={{ color: '#475569' }} />
        <Line type="monotone" dataKey={dataKey1} stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 8 }} />
        {dataKey2 && <Line type="monotone" dataKey={dataKey2} stroke="#10b981" strokeWidth={3} />}
      </ReLineChart>
    </ResponsiveContainer>
  );
}

export function WaveChartCard({ data, dataKey, xAxisKey }: { data: Record<string, string | number>[], dataKey: string, xAxisKey: string }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReAreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorWave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis dataKey={xAxisKey} stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b' }} />
        <Area type="monotone" dataKey={dataKey} stroke="#ec4899" fillOpacity={1} fill="url(#colorWave)" />
      </ReAreaChart>
    </ResponsiveContainer>
  );
}
