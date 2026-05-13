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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author: string
          category: string
          created_at: string
          id: string
          link: string
          order_index: number
          read_time: string
          title: string
        }
        Insert: {
          author?: string
          category?: string
          created_at?: string
          id?: string
          link?: string
          order_index?: number
          read_time?: string
          title: string
        }
        Update: {
          author?: string
          category?: string
          created_at?: string
          id?: string
          link?: string
          order_index?: number
          read_time?: string
          title?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          message: string
          name: string
          project_type: string | null
          read: boolean
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          project_type?: string | null
          read?: boolean
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          project_type?: string | null
          read?: boolean
        }
        Relationships: []
      }
      open_roles: {
        Row: {
          apply_link: string
          created_at: string
          department: string
          id: string
          order_index: number
          title: string
          type: string
        }
        Insert: {
          apply_link?: string
          created_at?: string
          department?: string
          id?: string
          order_index?: number
          title: string
          type?: string
        }
        Update: {
          apply_link?: string
          created_at?: string
          department?: string
          id?: string
          order_index?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      perks: {
        Row: {
          created_at: string
          description: string
          emoji: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          emoji?: string
          id?: string
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          emoji?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      portal_messages: {
        Row: {
          created_at: string
          customer_id: string
          id: string
          is_from_admin: boolean
          message: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          id?: string
          is_from_admin?: boolean
          message: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          id?: string
          is_from_admin?: boolean
          message?: string
        }
        Relationships: []
      }
      process_steps: {
        Row: {
          created_at: string
          description: string
          id: string
          number: string
          order_index: number
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          number: string
          order_index?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          number?: string
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string
          gradient: string
          id: string
          metric: string
          name: string
          original_id: string | null
          problem: string
          stack: string[]
          status: string
        }
        Insert: {
          category: string
          created_at?: string
          gradient: string
          id?: string
          metric: string
          name: string
          original_id?: string | null
          problem: string
          stack?: string[]
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          gradient?: string
          id?: string
          metric?: string
          name?: string
          original_id?: string | null
          problem?: string
          stack?: string[]
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          order_index: number
          original_id: string | null
          span: string | null
          status: string
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          order_index?: number
          original_id?: string | null
          span?: string | null
          status?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          order_index?: number
          original_id?: string | null
          span?: string | null
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "services_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      stats: {
        Row: {
          created_at: string
          id: string
          label: string
          original_id: string | null
          status: string
          suffix: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          original_id?: string | null
          status?: string
          suffix?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          original_id?: string | null
          status?: string
          suffix?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "stats_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "stats"
            referencedColumns: ["id"]
          },
        ]
      }
      tech_stack: {
        Row: {
          category: string
          created_at: string
          id: string
          items: string[]
          order_index: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          items?: string[]
          order_index?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          items?: string[]
          order_index?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          customer_id: string | null
          flag: string
          id: string
          name: string
          original_id: string | null
          quote: string
          role: string
          status: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          flag: string
          id?: string
          name: string
          original_id?: string | null
          quote: string
          role: string
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          flag?: string
          id?: string
          name?: string
          original_id?: string | null
          quote?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_original_id_fkey"
            columns: ["original_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
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
    Enums: {
      app_role: ["admin", "customer"],
    },
  },
} as const
