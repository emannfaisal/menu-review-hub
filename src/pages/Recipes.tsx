import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecipeForm } from "@/components/recipes/RecipeForm";
import { RecipeList } from "@/components/recipes/RecipeList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Recipes() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recipe Management</h1>
          <p className="text-muted-foreground">Add and manage recipes for your meal plans</p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList>
            <TabsTrigger value="add">Add New Recipe</TabsTrigger>
            <TabsTrigger value="list">View Recipes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="mt-6">
            <RecipeForm />
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <RecipeList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
