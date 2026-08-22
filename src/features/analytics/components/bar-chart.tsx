"use client";

import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { BarChart3 } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  title: string;
  description?: string;
  data: DataPoint[] | null;
  defaultColor?: string;
}

export function BarChart({ title, description, data, defaultColor = "#2563EB" }: BarChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="rounded-xl shadow-sm border border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">{title}</CardTitle>
        {description && <CardDescription className="text-sm text-slate-500">{description}</CardDescription>}
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
              <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || defaultColor} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
