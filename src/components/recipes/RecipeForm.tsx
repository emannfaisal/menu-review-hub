import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const recipeSchema = z.object({
  name: z.string().min(2, "Recipe name must be at least 2 characters"),
  instructions: z.string().optional(),
  tags: z.string().optional(),
  total_calories: z.coerce.number().min(0).optional(),
  total_protein: z.coerce.number().min(0).optional(),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

interface IngredientEntry {
  ingredient_id: string;
  quantity: number;
  unit: string;
  is_optional: boolean;
  is_garnish: boolean;
}

export function RecipeForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ingredients, setIngredients] = useState<IngredientEntry[]>([]);

  const form = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: "",
      instructions: "",
      tags: "",
      total_calories: undefined,
      total_protein: undefined,
    },
  });

  // Fetch available ingredients
  const { data: availableIngredients } = useQuery({
    queryKey: ["ingredients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredients")
        .select("id, name, category, default_unit")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        ingredient_id: "",
        quantity: 0,
        unit: "g",
        is_optional: false,
        is_garnish: false,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof IngredientEntry, value: any) => {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-fill unit from ingredient's default_unit
    if (field === "ingredient_id" && availableIngredients) {
      const selectedIngredient = availableIngredients.find(i => i.id === value);
      if (selectedIngredient?.default_unit) {
        updated[index].unit = selectedIngredient.default_unit;
      }
    }
    
    setIngredients(updated);
  };

  const onSubmit = async (data: RecipeFormData) => {
    if (ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const invalidIngredients = ingredients.some(
      (i) => !i.ingredient_id || i.quantity <= 0
    );
    if (invalidIngredients) {
      toast({
        title: "Error",
        description: "Please fill in all ingredient details correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert recipe
      const { data: newRecipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: data.name,
          instructions: data.instructions || null,
          tags: data.tags ? data.tags.split(",").map((t) => t.trim()) : null,
          total_calories: data.total_calories || null,
          total_protein: data.total_protein || null,
        })
        .select("id")
        .single();

      if (recipeError) throw recipeError;

      // Insert recipe ingredients
      const recipeIngredients = ingredients.map((ing) => ({
        recipe_id: newRecipe.id,
        ingredient_id: ing.ingredient_id,
        quantity: ing.quantity,
        unit: ing.unit,
        is_optional: ing.is_optional,
        is_garnish: ing.is_garnish,
      }));

      const { error: ingredientsError } = await supabase
        .from("recipe_ingredients")
        .insert(recipeIngredients);

      if (ingredientsError) throw ingredientsError;

      toast({
        title: "Success",
        description: "Recipe created successfully!",
      });

      // Reset form
      form.reset();
      setIngredients([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create recipe",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Recipe Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipe Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Grilled Chicken Salad" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Step-by-step cooking instructions..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total_calories"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Calories</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_protein"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Protein (g)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., high-protein, low-carb, quick" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Ingredients Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Ingredients</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
              <Plus className="mr-2 h-4 w-4" />
              Add Ingredient
            </Button>
          </CardHeader>
          <CardContent>
            {ingredients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No ingredients added yet. Click "Add Ingredient" to start.
              </p>
            ) : (
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-12 gap-3 items-end p-4 rounded-lg border bg-muted/30"
                  >
                    <div className="col-span-4">
                      <label className="text-sm font-medium">Ingredient *</label>
                      <Select
                        value={ingredient.ingredient_id}
                        onValueChange={(value) =>
                          updateIngredient(index, "ingredient_id", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ingredient" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableIngredients?.map((ing) => (
                            <SelectItem key={ing.id} value={ing.id}>
                              {ing.name} ({ing.category})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Quantity *</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.1"
                        value={ingredient.quantity || ""}
                        onChange={(e) =>
                          updateIngredient(index, "quantity", parseFloat(e.target.value) || 0)
                        }
                        placeholder="100"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="text-sm font-medium">Unit *</label>
                      <Select
                        value={ingredient.unit}
                        onValueChange={(value) => updateIngredient(index, "unit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="g">grams (g)</SelectItem>
                          <SelectItem value="ml">milliliters (ml)</SelectItem>
                          <SelectItem value="pcs">pieces</SelectItem>
                          <SelectItem value="tbsp">tablespoon</SelectItem>
                          <SelectItem value="tsp">teaspoon</SelectItem>
                          <SelectItem value="cup">cup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-1 flex items-center gap-2">
                      <Checkbox
                        id={`optional-${index}`}
                        checked={ingredient.is_optional}
                        onCheckedChange={(checked) =>
                          updateIngredient(index, "is_optional", checked)
                        }
                      />
                      <label htmlFor={`optional-${index}`} className="text-xs">
                        Optional
                      </label>
                    </div>

                    <div className="col-span-1 flex items-center gap-2">
                      <Checkbox
                        id={`garnish-${index}`}
                        checked={ingredient.is_garnish}
                        onCheckedChange={(checked) =>
                          updateIngredient(index, "is_garnish", checked)
                        }
                      />
                      <label htmlFor={`garnish-${index}`} className="text-xs">
                        Garnish
                      </label>
                    </div>

                    <div className="col-span-2 flex justify-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Creating Recipe..." : "Create Recipe"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
