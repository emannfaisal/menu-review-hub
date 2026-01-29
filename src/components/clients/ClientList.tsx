import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Target, FileText } from "lucide-react";

interface NutritionalTargets {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
}

interface Client {
  id: string;
  name: string;
  preferences_text: string | null;
  nutritional_targets: NutritionalTargets | null;
}

export function ClientList() {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) throw error;
      return data as Client[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading clients: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No clients found. Add your first client!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client) => (
        <Card key={client.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {client.name}
            </CardTitle>
            {client.preferences_text && (
              <CardDescription className="flex items-start gap-2">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{client.preferences_text}</span>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {client.nutritional_targets && Object.keys(client.nutritional_targets).length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Target className="h-4 w-4" />
                  <span>Daily Targets</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {client.nutritional_targets.calories && (
                    <Badge variant="secondary">
                      {client.nutritional_targets.calories} cal
                    </Badge>
                  )}
                  {client.nutritional_targets.protein && (
                    <Badge variant="secondary">
                      {client.nutritional_targets.protein}g protein
                    </Badge>
                  )}
                  {client.nutritional_targets.carbs && (
                    <Badge variant="secondary">
                      {client.nutritional_targets.carbs}g carbs
                    </Badge>
                  )}
                  {client.nutritional_targets.fat && (
                    <Badge variant="secondary">
                      {client.nutritional_targets.fat}g fat
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No nutritional targets set</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
