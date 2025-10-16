"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export interface SensorData {
  timestamp: number;
  value: number;
}

const UNUSUAL_CHANGE_THRESHOLD = 50; // A sudden change of 50 units is considered unusual

export function useSerial(maxDataPoints: number = 100) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [data, setData] = useState<SensorData[]>([]);
  const [isUnusual, setIsUnusual] = useState(false);

  const port = useRef<SerialPort | null>(null);
  const reader = useRef<ReadableStreamDefaultReader<string> | null>(null);
  const writer = useRef<WritableStreamDefaultWriter<string> | null>(null);
  const keepReading = useRef(false);
  const unusualPatternTimeout = useRef<NodeJS.Timeout | null>(null);

  const disconnect = useCallback(async () => {
    if (!port.current) return;
    
    keepReading.current = false;
    
    if (reader.current) {
      try {
        await reader.current.cancel();
      } catch (error) {
        // Ignore cancel error
      }
    }

    if (writer.current) {
        try {
            await writer.current.close();
        } catch (error) {
            // Ignore close error
        }
    }
    
    try {
      await port.current.close();
    } catch (error) {
      console.error("Error closing port:", error);
    }
    
    port.current = null;
    reader.current = null;
    writer.current = null;
    setIsConnected(false);
    
    toast({
      title: "Disconnected",
      description: "Serial device has been disconnected.",
    });
  }, [toast]);

  const connect = useCallback(async () => {
    if (!("serial" in navigator)) {
      toast({
        variant: "destructive",
        title: "Unsupported Browser",
        description: "Web Serial API is not supported in this browser.",
      });
      return;
    }

    try {
      port.current = await navigator.serial.requestPort();
      await port.current.open({ baudRate: 9600 });

      const textDecoder = new TextDecoderStream();
      port.current.readable.pipeTo(textDecoder.writable);
      reader.current = textDecoder.readable.getReader();

      const textEncoder = new TextEncoderStream();
      textEncoder.readable.pipeTo(port.current.writable);
      writer.current = textEncoder.writable.getWriter();

      setIsConnected(true);
      keepReading.current = true;
      toast({
        title: "Connected!",
        description: "Successfully connected to the serial device.",
      });

      let buffer = '';
      let lastValue: number | null = null;
      while (port.current?.readable && keepReading.current) {
        try {
          const { value, done } = await reader.current.read();
          if (done) {
            break;
          }
          buffer += value;
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine) {
              const numValue = parseFloat(trimmedLine);
              if (!isNaN(numValue)) {
                
                if(lastValue !== null) {
                  if (Math.abs(numValue - lastValue) > UNUSUAL_CHANGE_THRESHOLD) {
                    setIsUnusual(true);
                    if (unusualPatternTimeout.current) {
                      clearTimeout(unusualPatternTimeout.current);
                    }
                    unusualPatternTimeout.current = setTimeout(() => setIsUnusual(false), 3000);
                  }
                }
                lastValue = numValue;

                setData((prevData) => {
                  const newData = [
                    ...prevData,
                    { timestamp: Date.now(), value: numValue },
                  ];
                  return newData.length > maxDataPoints
                    ? newData.slice(newData.length - maxDataPoints)
                    : newData;
                });
              }
            }
          }
        } catch (error) {
          console.error("Error reading from serial port:", error);
          toast({
            variant: "destructive",
            title: "Read Error",
            description: "An error occurred while reading from the device.",
          });
          keepReading.current = false;
        }
      }

      if (port.current) {
          disconnect();
      }

    } catch (error) {
      console.error("Failed to connect:", error);
      if ((error as Error).name !== 'NotFoundError') {
        toast({
            variant: "destructive",
            title: "Connection Failed",
            description: "Could not connect to the serial device.",
        });
      }
    }
  }, [toast, maxDataPoints, disconnect]);
  
  const write = useCallback(async (message: string) => {
    if (!writer.current) {
        toast({
            variant: "destructive",
            title: "Write Error",
            description: "Serial device is not connected for writing.",
        });
        return;
    }
    try {
        await writer.current.write(message + '\n');
    } catch (error) {
        console.error("Failed to write to serial port:", error);
        toast({
            variant: "destructive",
            title: "Write Error",
            description: "Could not send data to the device.",
        });
    }
  }, [toast]);
  
  useEffect(() => {
    const handleDisconnectEvent = (e: Event) => {
      if (e.target === port.current) {
        disconnect();
      }
    };

    navigator.serial?.addEventListener('disconnect', handleDisconnectEvent);
    
    return () => {
      navigator.serial?.removeEventListener('disconnect', handleDisconnectEvent);
      if(unusualPatternTimeout.current) {
        clearTimeout(unusualPatternTimeout.current);
      }
      if(isConnected) {
        disconnect();
      }
    };
  }, [disconnect, isConnected]);

  return { isConnected, data, connect, disconnect, write, isUnusual };
}
