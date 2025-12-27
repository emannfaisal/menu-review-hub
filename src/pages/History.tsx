import { useMenuReview } from "@/hooks/useMenuReview";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { MealGrid } from "@/components/dashboard/MealGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, User } from "lucide-react";

export default function History() {
  const { menus, isLoading, error } = useMenuReview('approved');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Approved History</h2>
          <p className="text-muted-foreground">Previously approved client menus</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load history</p>
          </div>
        )}

        {!isLoading && !error && menus?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <CheckCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium text-foreground">No approved menus yet</p>
            <p className="text-sm text-muted-foreground">
              Approved menus will appear here
            </p>
          </div>
        )}

        <div className="space-y-4">
          {menus?.map((menu) => (
            <Card key={menu.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                      <User className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{menu.client?.name ?? 'Unknown Client'}</CardTitle>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">Approved</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <MealGrid menuItems={menu.menu_items} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
