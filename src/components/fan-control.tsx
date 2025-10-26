"use client";

import { Fan, Power, PowerOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface FanControlProps {
  onToggle: (isOn: boolean) => void;
  disabled: boolean;
}

export default function FanControl({ onToggle, disabled }: FanControlProps) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    onToggle(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Fan className="w-5 h-5" />
          <span>Fan Control</span>
        </CardTitle>
        <CardDescription>
          {disabled ? "Connect a device to control the fan" : "Toggle the ventilation fan on or off."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <Label htmlFor="fan-switch" className="flex flex-col space-y-1">
            <span>Fan Status</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Turn the main ventilation fan on or off.
            </span>
          </Label>
          <Switch
            id="fan-switch"
            checked={isOn}
            onCheckedChange={handleToggle}
            disabled={disabled}
            aria-label="Fan Switch"
          />
        </div>
         <div className="flex items-center justify-center text-sm text-muted-foreground pt-4">
            {isOn ? (
                <Power className="mr-2 text-green-500" />
            ) : (
                <PowerOff className="mr-2 text-red-500" />
            )}
            <span>{isOn ? "On" : "Off"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
