"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Wand2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { enhanceChart } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { SuggestColorSchemeOutput } from "@/ai/flows/suggest-color-scheme";

const formSchema = z.object({
  description: z.string().min(10, {
    message: "Please provide a more detailed description (at least 10 characters).",
  }),
});

interface AIEnhancerProps {
  onSuggestion: (suggestion: SuggestColorSchemeOutput) => void;
}

export default function AIEnhancer({ onSuggestion }: AIEnhancerProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await enhanceChart(values.description);
    if (result.success && result.data) {
      onSuggestion(result.data);
      toast({
        title: "Chart Enhanced!",
        description: "The AI has provided a new title and color scheme.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "AI Enhancement Failed",
        description: result.error || "An unknown error occurred.",
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Wand2 className="w-5 h-5" />
          <span>AI Chart Enhancer</span>
        </CardTitle>
        <CardDescription>
          Describe your data, and let AI suggest a title and color scheme.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., 'Real-time temperature readings from a CPU sensor'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enhancing..." : "Enhance Chart"}
              {!isSubmitting && <Wand2 className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
