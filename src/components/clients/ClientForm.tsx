import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, UserPlus } from "lucide-react";

const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  preferences_text: z.string().optional(),
  daily_calories: z.coerce.number().min(0).optional(),
  daily_protein: z.coerce.number().min(0).optional(),
  daily_carbs: z.coerce.number().min(0).optional(),
  daily_fat: z.coerce.number().min(0).optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export function ClientForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      preferences_text: "",
      daily_calories: undefined,
      daily_protein: undefined,
      daily_carbs: undefined,
      daily_fat: undefined,
    },
  });

  async function onSubmit(data: ClientFormValues) {
    setIsSubmitting(true);

    try {
      // Build nutritional_targets JSON
      const nutritionalTargets: Record<string, number> = {};
      if (data.daily_calories) nutritionalTargets.calories = data.daily_calories;
      if (data.daily_protein) nutritionalTargets.protein = data.daily_protein;
      if (data.daily_carbs) nutritionalTargets.carbs = data.daily_carbs;
      if (data.daily_fat) nutritionalTargets.fat = data.daily_fat;

      const { error } = await supabase.from("clients").insert({
        name: data.name,
        preferences_text: data.preferences_text || null,
        nutritional_targets: Object.keys(nutritionalTargets).length > 0 ? nutritionalTargets : null,
      });

      if (error) throw error;

      toast({
        title: "Client added!",
        description: `${data.name} has been added successfully.`,
      });

      form.reset();
    } catch (error: any) {
      toast({
        title: "Error adding client",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Add New Client
        </CardTitle>
        <CardDescription>
          Enter client details and nutritional targets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferences_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dietary Preferences & Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="E.g., Prefers Mediterranean cuisine, dislikes spicy food, vegetarian on weekdays..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Any dietary preferences, restrictions, or notes about this client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Nutritional Targets */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Daily Nutritional Targets</h3>
              <p className="text-sm text-muted-foreground">
                Optional: Set daily nutritional goals for this client
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="daily_calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calories</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="2000"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_protein"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protein (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="150"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_carbs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carbs (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="250"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="daily_fat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fat (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="65"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Client
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
