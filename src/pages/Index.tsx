import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ReviewQueue } from "@/components/dashboard/ReviewQueue";

const Index = () => {
  return (
    <DashboardLayout>
      <ReviewQueue />
    </DashboardLayout>
  );
};

export default Index;
