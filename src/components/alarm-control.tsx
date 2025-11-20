"use client";

import { AlarmClockOff, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface AlarmControlProps {
  onToggle: (isMuted: boolean) => void;
  disabled: boolean;
}

export default function AlarmControl({ onToggle, disabled }: AlarmControlProps) {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = (checked: boolean) => {
    setIsMuted(checked);
    onToggle(checked);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bell className="w-5 h-5" />
          <span>Alarm Control</span>
        </CardTitle>
        <CardDescription>
          {disabled ? "Connect a device to control the alarm" : "Manually mute the safety alarm."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between space-x-4 rounded-lg border p-4">
          <Label htmlFor="alarm-switch" className="flex flex-col space-y-1">
            <span>Mute Alarm</span>
            <span className="font-normal leading-snug text-muted-foreground">
              Overrides the automatic alarm.
            </span>
          </Label>
          <Switch
            id="alarm-switch"
            checked={isMuted}
            onCheckedChange={handleToggle}
            disabled={disabled}
            aria-label="Alarm Mute Switch"
          />
        </div>
         <div className="flex items-center justify-center text-sm text-muted-foreground pt-4">
            {isMuted ? (
                <AlarmClockOff className="mr-2 text-red-500" />
            ) : (
                <Bell className="mr-2 text-green-500" />
            )}
            <span>{isMuted ? "Muted" : "Active"}</span>
        </div>
      </CardContent>
    </Card>
  );
}
