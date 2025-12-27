import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Settings</h2>
          <p className="text-muted-foreground">Configure your dashboard preferences</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <SettingsIcon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-menus">New menu alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when new menus are ready for review
                </p>
              </div>
              <Switch id="new-menus" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-digest">Daily digest</Label>
                <p className="text-sm text-muted-foreground">
                  Receive a summary of pending menus each morning
                </p>
              </div>
              <Switch id="email-digest" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
