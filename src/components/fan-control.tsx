"use client";

import { Fan } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

interface FanControlProps {
  onPowerChange: (power: number) => void;
  disabled: boolean;
}

export default function FanControl({ onPowerChange, disabled }: FanControlProps) {
  const [power, setPower] = useState(0);

  const handlePowerChange = (newPower: number[]) => {
    const p = newPower[0];
    setPower(p);
  };
  
  const handleCommit = (newPower: number[]) => {
    onPowerChange(newPower[0]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Fan className="w-5 h-5" />
          <span>Fan Control</span>
        </CardTitle>
        <CardDescription>
          {disabled ? "Connect a device to control the fan" : "Adjust fan speed from 0% to 100%"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="fan-power-slider" className="text-muted-foreground">
              Fan Speed
            </Label>
            <span className="font-bold text-lg w-16 text-right">{power}%</span>
          </div>
          <Slider
            id="fan-power-slider"
            min={0}
            max={100}
            step={10}
            value={[power]}
            onValueChange={handlePowerChange}
            onValueCommit={handleCommit}
            disabled={disabled}
            aria-label="Fan Power"
          />
        </div>
      </CardContent>
    </Card>
  );
}
