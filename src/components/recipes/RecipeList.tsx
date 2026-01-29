import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function RecipeList() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes-with-ingredients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select(`
          id,
          name,
          instructions,
          tags,
          total_calories,
          total_protein,
          recipe_ingredients (
            quantity,
            unit,
            is_optional,
            is_garnish,
            ingredients (
              name,
              category
            )
          )
        `)
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!recipes || recipes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No recipes found. Add your first recipe!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Card key={recipe.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">{recipe.name}</CardTitle>
            <div className="flex gap-2 flex-wrap">
              {recipe.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-4 text-sm">
              {recipe.total_calories && (
                <span className="text-muted-foreground">
                  <strong>{recipe.total_calories}</strong> cal
                </span>
              )}
              {recipe.total_protein && (
                <span className="text-muted-foreground">
                  <strong>{recipe.total_protein}g</strong> protein
                </span>
              )}
            </div>

            {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-1">Ingredients:</p>
                <ul className="text-sm text-muted-foreground space-y-0.5">
                  {recipe.recipe_ingredients.slice(0, 5).map((ri, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span>•</span>
                      <span>
                        {ri.quantity} {ri.unit} {ri.ingredients?.name}
                        {ri.is_optional && <span className="text-xs italic"> (optional)</span>}
                        {ri.is_garnish && <span className="text-xs italic"> (garnish)</span>}
                      </span>
                    </li>
                  ))}
                  {recipe.recipe_ingredients.length > 5 && (
                    <li className="text-xs italic">
                      +{recipe.recipe_ingredients.length - 5} more ingredients
                    </li>
                  )}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
