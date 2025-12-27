import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MenuItem {
  id: string;
  day: string | null;
  meal_type: string | null;
  recipe: {
    id: string;
    name: string;
    total_calories: number | null;
    total_protein: number | null;
  } | null;
}

export interface GeneratedMenu {
  id: string;
  status: string | null;
  ai_explanation: string | null;
  feedback: string | null;
  client: {
    id: string;
    name: string;
  } | null;
  menu_items: MenuItem[];
}

export interface GroupedMenus {
  [clientName: string]: GeneratedMenu[];
}

export function useMenuReview(statusFilter: string = 'draft') {
  const queryClient = useQueryClient();

  const { data: menus, isLoading, error } = useQuery({
    queryKey: ['menus', statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('generated_menus')
        .select(`
          id,
          status,
          ai_explanation,
          feedback,
          client:clients(id, name),
          menu_items(
            id,
            day,
            meal_type,
            recipe:recipes(id, name, total_calories, total_protein)
          )
        `)
        .eq('status', statusFilter);

      if (error) throw error;
      return data as unknown as GeneratedMenu[];
    },
  });

  const groupedMenus: GroupedMenus = (menus ?? []).reduce((acc, menu) => {
    const clientName = menu.client?.name ?? 'Unknown Client';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(menu);
    return acc;
  }, {} as GroupedMenus);

  const approveMenu = useMutation({
    mutationFn: async (menuId: string) => {
      const { error } = await supabase
        .from('generated_menus')
        .update({ status: 'approved' })
        .eq('id', menuId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      toast.success('Menu sent to client history');
    },
    onError: (error) => {
      toast.error(`Failed to approve: ${error.message}`);
    },
  });

  const rejectMenu = useMutation({
    mutationFn: async ({ menuId, feedback }: { menuId: string; feedback: string }) => {
      const { error } = await supabase
        .from('generated_menus')
        .update({ status: 'rejected', feedback })
        .eq('id', menuId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menus'] });
      toast.success('Sent to AI for regeneration');
    },
    onError: (error) => {
      toast.error(`Failed to reject: ${error.message}`);
    },
  });

  return {
    menus,
    groupedMenus,
    isLoading,
    error,
    approveMenu,
    rejectMenu,
  };
}
