import { useState } from "react";
import { ChevronDown, ChevronRight, Check, X, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MealGrid } from "./MealGrid";
import { RejectDialog } from "./RejectDialog";
import { GeneratedMenu } from "@/hooks/useMenuReview";

interface ClientMenuCardProps {
  clientName: string;
  menus: GeneratedMenu[];
  onApprove: (menuId: string) => void;
  onReject: (menuId: string, feedback: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}

export function ClientMenuCard({
  clientName,
  menus,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: ClientMenuCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const handleRejectClick = (menuId: string) => {
    setSelectedMenuId(menuId);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = (feedback: string) => {
    if (selectedMenuId) {
      onReject(selectedMenuId, feedback);
      setRejectDialogOpen(false);
      setSelectedMenuId(null);
    }
  };

  const totalMenus = menus.length;

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                    <User className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{clientName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {totalMenus} draft menu{totalMenus !== 1 ? 's' : ''} pending review
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {totalMenus} Draft{totalMenus !== 1 ? 's' : ''}
                  </Badge>
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6 pt-0">
              {menus.map((menu) => (
                <div key={menu.id} className="space-y-4 rounded-lg border border-border bg-card p-4">
                  {menu.ai_explanation && (
                    <div className="rounded-md bg-accent/50 p-3">
                      <p className="text-sm text-accent-foreground">
                        <span className="font-medium">AI Note:</span> {menu.ai_explanation}
                      </p>
                    </div>
                  )}
                  
                  <MealGrid menuItems={menu.menu_items} />
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleRejectClick(menu.id)}
                      disabled={isRejecting}
                    >
                      <X className="mr-1.5 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => onApprove(menu.id)}
                      disabled={isApproving}
                    >
                      <Check className="mr-1.5 h-4 w-4" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        onConfirm={handleRejectConfirm}
        isLoading={isRejecting}
      />
    </>
  );
}
