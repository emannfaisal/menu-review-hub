export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      allergen_categories: {
        Row: {
          id: string
          name: string
          severity_level: string | null
        }
        Insert: {
          id?: string
          name: string
          severity_level?: string | null
        }
        Update: {
          id?: string
          name?: string
          severity_level?: string | null
        }
        Relationships: []
      }
      client_allergen_restrictions: {
        Row: {
          allergen_category_id: string
          client_id: string
        }
        Insert: {
          allergen_category_id: string
          client_id: string
        }
        Update: {
          allergen_category_id?: string
          client_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_allergen_restrictions_allergen_category_id_fkey"
            columns: ["allergen_category_id"]
            isOneToOne: false
            referencedRelation: "allergen_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_allergen_restrictions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_allergen_restrictions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "view_ai_client_profile"
            referencedColumns: ["client_id"]
          },
        ]
      }
      client_ingredient_exclusions: {
        Row: {
          client_id: string
          ingredient_id: string
          severity: string | null
        }
        Insert: {
          client_id: string
          ingredient_id: string
          severity?: string | null
        }
        Update: {
          client_id?: string
          ingredient_id?: string
          severity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_ingredient_exclusions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_ingredient_exclusions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "view_ai_client_profile"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "client_ingredient_exclusions_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          id: string
          name: string
          nutritional_targets: Json | null
          preferences_text: string | null
        }
        Insert: {
          id?: string
          name: string
          nutritional_targets?: Json | null
          preferences_text?: string | null
        }
        Update: {
          id?: string
          name?: string
          nutritional_targets?: Json | null
          preferences_text?: string | null
        }
        Relationships: []
      }
      generated_menus: {
        Row: {
          ai_explanation: string | null
          batch_id: string | null
          client_id: string | null
          feedback: string | null
          id: string
          status: string | null
        }
        Insert: {
          ai_explanation?: string | null
          batch_id?: string | null
          client_id?: string | null
          feedback?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          ai_explanation?: string | null
          batch_id?: string | null
          client_id?: string | null
          feedback?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_menus_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "weekly_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_menus_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_menus_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "view_ai_client_profile"
            referencedColumns: ["client_id"]
          },
        ]
      }
      ingredient_allergens: {
        Row: {
          allergen_category_id: string
          ingredient_id: string
        }
        Insert: {
          allergen_category_id: string
          ingredient_id: string
        }
        Update: {
          allergen_category_id?: string
          ingredient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ingredient_allergens_allergen_category_id_fkey"
            columns: ["allergen_category_id"]
            isOneToOne: false
            referencedRelation: "allergen_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ingredient_allergens_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          calories_per_100g: number | null
          category: string | null
          default_unit: string | null
          id: string
          name: string
          protein_per_100g: number | null
        }
        Insert: {
          calories_per_100g?: number | null
          category?: string | null
          default_unit?: string | null
          id?: string
          name: string
          protein_per_100g?: number | null
        }
        Update: {
          calories_per_100g?: number | null
          category?: string | null
          default_unit?: string | null
          id?: string
          name?: string
          protein_per_100g?: number | null
        }
        Relationships: []
      }
      meal_history: {
        Row: {
          client_id: string
          id: string
          recipe_id: string
          served_date: string
        }
        Insert: {
          client_id: string
          id?: string
          recipe_id: string
          served_date: string
        }
        Update: {
          client_id?: string
          id?: string
          recipe_id?: string
          served_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_history_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "view_ai_client_profile"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "meal_history_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_history_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "view_ai_recipe_catalog"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      menu_item_modifications: {
        Row: {
          action: string
          ingredient_id: string
          menu_item_id: string
        }
        Insert: {
          action: string
          ingredient_id: string
          menu_item_id: string
        }
        Update: {
          action?: string
          ingredient_id?: string
          menu_item_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_item_modifications_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_item_modifications_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          day: string | null
          id: string
          meal_type: string | null
          menu_id: string | null
          recipe_id: string | null
        }
        Insert: {
          day?: string | null
          id?: string
          meal_type?: string | null
          menu_id?: string | null
          recipe_id?: string | null
        }
        Update: {
          day?: string | null
          id?: string
          meal_type?: string | null
          menu_id?: string | null
          recipe_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_menu_id_fkey"
            columns: ["menu_id"]
            isOneToOne: false
            referencedRelation: "generated_menus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "menu_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "view_ai_recipe_catalog"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          id: string
          ingredient_id: string
          is_garnish: boolean | null
          is_optional: boolean | null
          quantity: number
          recipe_id: string
          unit: string
        }
        Insert: {
          id?: string
          ingredient_id: string
          is_garnish?: boolean | null
          is_optional?: boolean | null
          quantity: number
          recipe_id: string
          unit: string
        }
        Update: {
          id?: string
          ingredient_id?: string
          is_garnish?: boolean | null
          is_optional?: boolean | null
          quantity?: number
          recipe_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "view_ai_recipe_catalog"
            referencedColumns: ["recipe_id"]
          },
        ]
      }
      recipes: {
        Row: {
          embedding: string | null
          id: string
          instructions: string | null
          name: string
          tags: string[] | null
          total_calories: number | null
          total_protein: number | null
        }
        Insert: {
          embedding?: string | null
          id?: string
          instructions?: string | null
          name: string
          tags?: string[] | null
          total_calories?: number | null
          total_protein?: number | null
        }
        Update: {
          embedding?: string | null
          id?: string
          instructions?: string | null
          name?: string
          tags?: string[] | null
          total_calories?: number | null
          total_protein?: number | null
        }
        Relationships: []
      }
      weekly_batches: {
        Row: {
          id: string
          status: string | null
          week_start_date: string
        }
        Insert: {
          id?: string
          status?: string | null
          week_start_date: string
        }
        Update: {
          id?: string
          status?: string | null
          week_start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      view_ai_client_profile: {
        Row: {
          client_id: string | null
          excluded_ingredients: Json | null
          name: string | null
          nutritional_targets: Json | null
          recent_meal_names: Json | null
          severe_allergies: Json | null
        }
        Insert: {
          client_id?: string | null
          excluded_ingredients?: never
          name?: string | null
          nutritional_targets?: Json | null
          recent_meal_names?: never
          severe_allergies?: never
        }
        Update: {
          client_id?: string | null
          excluded_ingredients?: never
          name?: string | null
          nutritional_targets?: Json | null
          recent_meal_names?: never
          severe_allergies?: never
        }
        Relationships: []
      }
      view_ai_recipe_catalog: {
        Row: {
          contains_allergens: Json | null
          ingredients_list: Json | null
          name: string | null
          recipe_id: string | null
          tags: string[] | null
          total_calories: number | null
          total_protein: number | null
        }
        Insert: {
          contains_allergens?: never
          ingredients_list?: never
          name?: string | null
          recipe_id?: string | null
          tags?: string[] | null
          total_calories?: number | null
          total_protein?: number | null
        }
        Update: {
          contains_allergens?: never
          ingredients_list?: never
          name?: string | null
          recipe_id?: string | null
          tags?: string[] | null
          total_calories?: number | null
          total_protein?: number | null
        }
        Relationships: []
      }
      view_batch_menu_groups: {
        Row: {
          available_recipes: Json | null
          clients: Json | null
          primary_group_id: number | null
          secondary_group_id: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      save_full_menu: {
        Args: { p_ai_data: Json; p_batch_id: string; p_client_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
