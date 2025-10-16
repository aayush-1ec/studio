"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SensorData } from "@/hooks/use-serial";
import { useMemo } from "react";

interface LiveChartProps {
  data: SensorData[];
  title: string;
  description: string;
  color: string;
}

export default function LiveChart({ data, title, description, color }: LiveChartProps) {
  const chartConfig = useMemo(() => ({
    value: {
      label: "Sensor Value",
      color: color,
    },
  }), [color]) satisfies ChartConfig;
  
  const chartData = useMemo(() => {
      if (data.length === 0) {
        return Array.from({ length: 10 }, (_, i) => ({ timestamp: Date.now() + i * 1000, value: 0 }));
      }
      return data;
  }, [data])

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip
                            cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={data.length > 0}
                            animationDuration={300}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}
