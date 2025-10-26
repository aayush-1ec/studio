"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceArea } from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SensorData } from "@/hooks/use-serial";
import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

interface LiveChartProps {
  data: SensorData[];
  title: string;
  description: string;
  color: string;
  dataKey: keyof Omit<SensorData, 'timestamp'>;
  isUnusual: boolean;
}

export default function LiveChart({ data, title, description, color, dataKey, isUnusual }: LiveChartProps) {
  const chartConfig = useMemo(() => ({
    [dataKey]: {
      label: "Sensor Value",
      color: color,
    },
  }), [color, dataKey]) satisfies ChartConfig;
  
  const chartData = useMemo(() => {
      if (data.length === 0) {
        return Array.from({ length: 100 }, (_, i) => ({ timestamp: Date.now() + i * 100, [dataKey]: 0, co2: 0, temperature: 0, humidity: 0 }));
      }
      return data;
  }, [data, dataKey]);

  const lastTimestamp = chartData.length > 0 ? chartData[chartData.length - 1].timestamp : null;

  return (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <span>{title}</span>
              {isUnusual && dataKey === 'co2' && (
                <div className="flex items-center gap-2 text-yellow-500 animate-pulse">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-medium">Unusual CO2 pattern</span>
                </div>
              )}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px] w-full">
                <ResponsiveContainer>
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                        />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={['dataMin - 10', 'dataMax + 10']} />
                        <Tooltip
                            cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 2 }}
                            content={<ChartTooltipContent indicator="dot" />}
                        />
                        <Line
                            type="monotone"
                            dataKey={dataKey}
                            stroke={color}
                            strokeWidth={2}
                            dot={false}
                            isAnimationActive={data.length > 0}
                            animationDuration={200}
                        />
                        {isUnusual && dataKey === 'co2' && lastTimestamp && (
                          <ReferenceArea
                            x1={lastTimestamp - 2000}
                            x2={lastTimestamp}
                            stroke="red"
                            strokeOpacity={0.3}
                            fill="red"
                            fillOpacity={0.1}
                          />
                        )}
                    </LineChart>
                </ResponsiveContainer>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}
