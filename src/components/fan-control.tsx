"use client";

import { Fan } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FanControlProps {
  onToggle: (isOn: boolean) => void;
  disabled: boolean;
}

export default function FanControl({ onToggle, disabled }: FanControlProps) {
  const handleToggle = (isOn: boolean) => {
    onToggle(isOn);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Fan className="w-5 h-5" />
          <span>Fan Control</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Label htmlFor="fan-switch" className="text-muted-foreground">
            {disabled ? "Connect device to control fan" : "Toggle fan power"}
          </Label>
          <Switch
            id="fan-switch"
            onCheckedChange={handleToggle}
            disabled={disabled}
            aria-label="Toggle Fan"
          />
        </div>
      </CardContent>
    </Card>
  );
}
