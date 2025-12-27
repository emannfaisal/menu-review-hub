import { useMenuReview } from "@/hooks/useMenuReview";
import { ClientMenuCard } from "./ClientMenuCard";
import { Loader2, Inbox } from "lucide-react";

export function ReviewQueue() {
  const { groupedMenus, isLoading, error, approveMenu, rejectMenu } = useMenuReview('draft');

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading menus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Failed to load menus</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  const clientNames = Object.keys(groupedMenus);

  if (clientNames.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <p className="text-lg font-medium text-foreground">No menus to review</p>
            <p className="text-sm text-muted-foreground">
              All draft menus have been processed
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Review Queue</h2>
        <p className="text-muted-foreground">
          {clientNames.length} client{clientNames.length !== 1 ? 's' : ''} with pending menus
        </p>
      </div>
      
      {clientNames.map((clientName) => (
        <ClientMenuCard
          key={clientName}
          clientName={clientName}
          menus={groupedMenus[clientName]}
          onApprove={(menuId) => approveMenu.mutate(menuId)}
          onReject={(menuId, feedback) => rejectMenu.mutate({ menuId, feedback })}
          isApproving={approveMenu.isPending}
          isRejecting={rejectMenu.isPending}
        />
      ))}
    </div>
  );
}
