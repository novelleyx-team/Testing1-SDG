"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { PieChart as PieChartIcon } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

const DEFAULT_COLORS = [
  '#2563EB', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#14B8A6', // Teal
];

interface DonutChartProps {
  title: string;
  description?: string;
  data: DataPoint[] | null;
}

export function DonutChart({ title, description, data }: DonutChartProps) {
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
              icon={<PieChartIcon className="w-8 h-8" />} 
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
