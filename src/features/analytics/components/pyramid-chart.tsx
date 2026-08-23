"use client";

import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/EmptyState";
import { Filter } from "lucide-react";

interface DataPoint {
  name: string;
  value: number;
  fill?: string;
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

interface PyramidChartProps {
  title: string;
  description?: string;
  data: DataPoint[] | null;
}

export function PyramidChart({ title, description, data }: PyramidChartProps) {
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
              icon={<Filter className="w-8 h-8" />} 
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0F172A', fontWeight: 500 }}
                />
                <Funnel
                  dataKey="value"
                  data={data}
                  isAnimationActive
                >
                  <LabelList position="right" fill="#0F172A" stroke="none" dataKey="name" />
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
