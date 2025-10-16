"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSerial } from "@/hooks/use-serial";
import { PlugZap, Power, PowerOff } from "lucide-react";
import AIEnhancer from "./ai-enhancer";
import FanControl from "./fan-control";
import LiveChart from "./live-chart";
import ExportControl from "./export-control";
import type { SuggestColorSchemeOutput } from "@/ai/flows/suggest-color-scheme";

export default function Dashboard() {
  const { isConnected, data, connect, disconnect, write } = useSerial(100);

  const [chartConfig, setChartConfig] = useState({
    title: "Live Sensor Data",
    description: "Connect a serial device to start streaming data.",
    color: "hsl(var(--primary))",
  });

  const handleFanToggle = useCallback(
    (isOn: boolean) => {
      write(isOn ? "1" : "0");
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-start">
      <div className="md:col-span-2 lg:col-span-2">
        <LiveChart 
          data={data}
          title={chartConfig.title}
          description={chartConfig.description}
          color={chartConfig.color}
        />
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
