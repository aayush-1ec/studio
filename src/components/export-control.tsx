"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { SensorData } from "@/hooks/use-serial";

interface ExportControlProps {
  data: SensorData[];
}

export default function ExportControl({ data }: ExportControlProps) {
  const { toast } = useToast();

  const handleExport = () => {
    if (data.length === 0) {
      toast({
        variant: "destructive",
        title: "No Data to Export",
        description: "Connect a device and gather some data first.",
      });
      return;
    }

    const headers = ["timestamp", "value"];
    const csvRows = [
      headers.join(","),
      ...data.map(row => `${new Date(row.timestamp).toISOString()},${row.value}`)
    ];
    const csvContent = csvRows.join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `sensor-data-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Sensor data has been downloaded as a CSV file.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Download className="w-5 h-5" />
          <span>Data Export</span>
        </CardTitle>
        <CardDescription>
          Download the collected sensor readings as a CSV file.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} className="w-full" disabled={data.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </Button>
      </CardContent>
    </Card>
  );
}
