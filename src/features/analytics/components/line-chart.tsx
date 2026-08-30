"use client";

import { Line, LineChart as RechartsLineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { BarChart3 } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
}

interface LineChartProps {
  title: string;
  description?: string;
  data: DataPoint[] | null;
  color?: string;
}

export function LineChart({ title, description, data, color = "#2563EB" }: LineChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 bg-white dark:bg-[#1F2937]">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-gray-100">{title}</CardTitle>
        {description && <CardDescription className="text-sm text-slate-500 dark:text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          {!hasData ? (
            <EmptyState 
              title="No Data Available" 
              description="Awaiting real-time live data stream from the database." 
              icon={<BarChart3 className="w-8 h-8" />} 
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
