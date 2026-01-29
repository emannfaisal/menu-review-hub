import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientForm } from "@/components/clients/ClientForm";
import { ClientList } from "@/components/clients/ClientList";

export default function Clients() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Management</h1>
          <p className="text-muted-foreground mt-1">
            Add and manage your nutrition clients
          </p>
        </div>

        <Tabs defaultValue="add" className="w-full">
          <TabsList>
            <TabsTrigger value="add">Add New Client</TabsTrigger>
            <TabsTrigger value="view">View Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="add" className="mt-6">
            <ClientForm />
          </TabsContent>
          
          <TabsContent value="view" className="mt-6">
            <ClientList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
