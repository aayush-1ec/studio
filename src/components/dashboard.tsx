"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSerial, type SensorData } from "@/hooks/use-serial";
import { PlugZap, Power, PowerOff, Thermometer, Droplets, CloudCog } from "lucide-react";
import AIEnhancer from "./ai-enhancer";
import FanControl from "./fan-control";
import LiveChart from "./live-chart";
import ExportControl from "./export-control";
import type { SuggestColorSchemeOutput } from "@/ai/flows/suggest-color-scheme";
import { cn } from "@/lib/utils";

type ChartDataKey = keyof Omit<SensorData, 'timestamp'>;

const CHART_CONFIGS: Record<ChartDataKey, { title: string, description: string, color: string, icon: React.ReactNode }> = {
    co2: {
        title: "Live CO2 Levels",
        description: "Real-time CO2 concentration in parts per million (ppm).",
        color: "hsl(var(--chart-1))",
        icon: <CloudCog className="w-4 h-4" />,
    },
    temperature: {
        title: "Live Temperature",
        description: "Real-time ambient temperature readings in Celsius.",
        color: "hsl(var(--chart-2))",
        icon: <Thermometer className="w-4 h-4" />,
    },
    humidity: {
        title: "Live Humidity",
        description: "Real-time relative humidity percentage.",
        color: "hsl(var(--chart-3))",
        icon: <Droplets className="w-4 h-4" />,
    },
};

export default function Dashboard() {
  const { isConnected, data, connect, disconnect, write, isUnusual } = useSerial(100);
  const [selectedDataKey, setSelectedDataKey] = useState<ChartDataKey>('co2');

  const [chartConfig, setChartConfig] = useState({
    title: "Live Sensor Data",
    description: "Connect a serial device to start streaming data.",
    color: "",
  });

  const handleFanToggle = useCallback(
    (isOn: boolean) => {
      write(isOn ? '1' : '0');
    },
    [write]
  );
  
  const handleSuggestion = useCallback((suggestion: SuggestColorSchemeOutput) => {
    const firstColor = suggestion.colorScheme.split(',')[0].trim();
    setChartConfig({
      title: suggestion.titleSuggestion,
      description: `AI-generated style for the dataset.`,
      color: firstColor,
    });
  }, []);
  
  const currentChartConfig = CHART_CONFIGS[selectedDataKey];
  const activeColor = chartConfig.color || currentChartConfig.color;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
      <div className="md:col-span-2 lg:col-span-2">
        <LiveChart 
          data={data}
          title={chartConfig.title === "Live Sensor Data" ? currentChartConfig.title : chartConfig.title}
          description={chartConfig.description === "Connect a serial device to start streaming data." ? currentChartConfig.description : chartConfig.description}
          color={activeColor}
          dataKey={selectedDataKey}
          isUnusual={isUnusual}
        />
        <div className="flex justify-center gap-2 mt-4">
            {(Object.keys(CHART_CONFIGS) as ChartDataKey[]).map((key) => (
                <Button 
                    key={key} 
                    variant={selectedDataKey === key ? "default" : "outline"} 
                    onClick={() => {
                        setSelectedDataKey(key);
                        // Reset AI enhancer when switching views
                        setChartConfig({
                            title: "Live Sensor Data",
                            description: "Connect a serial device to start streaming data.",
                            color: "",
                        });
                    }}
                    className={cn("gap-2", selectedDataKey === key && "shadow-md")}
                    style={{
                        backgroundColor: selectedDataKey === key ? CHART_CONFIGS[key].color : undefined,
                    }}
                >
                    {CHART_CONFIGS[key].icon}
                    {CHART_CONFIGS[key].title.replace("Live ", "")}
                </Button>
            ))}
        </div>
      </div>

      <div className="space-y-4 lg:space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <PlugZap className="w-5 h-5"/>
                <span>Device Connection</span>
            </CardTitle>
            <CardDescription>
                Connect to your monitoring hardware.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
                <Button onClick={isConnected ? disconnect : connect} variant={isConnected ? "destructive" : "default"}>
                    {isConnected ? <PowerOff /> : <Power />}
                    <span>{isConnected ? "Disconnect" : "Connect to Device"}</span>
                </Button>
                <div className="flex items-center justify-center text-sm text-muted-foreground pt-2">
                    <span className={`h-2 w-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    Status: {isConnected ? "Connected" : "Disconnected"}
                </div>
            </div>
          </CardContent>
        </Card>

        <FanControl onToggle={handleFanToggle} disabled={!isConnected} />

        <ExportControl data={data} />

        <AIEnhancer onSuggestion={handleSuggestion} />
      </div>
    </div>
  );
}
