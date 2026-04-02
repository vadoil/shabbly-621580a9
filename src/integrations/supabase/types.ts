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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      events: {
        Row: {
          address: string | null
          city: string
          date_end: string | null
          date_start: string
          id: string
          published: boolean | null
          status: string | null
          ticket_url: string | null
          title: string
          venue: string
        }
        Insert: {
          address?: string | null
          city: string
          date_end?: string | null
          date_start: string
          id?: string
          published?: boolean | null
          status?: string | null
          ticket_url?: string | null
          title: string
          venue: string
        }
        Update: {
          address?: string | null
          city?: string
          date_end?: string | null
          date_start?: string
          id?: string
          published?: boolean | null
          status?: string | null
          ticket_url?: string | null
          title?: string
          venue?: string
        }
        Relationships: []
      }
      friend_events: {
        Row: {
          city: string
          date_start: string
          id: string
          last_seen_at: string | null
          raw_json: Json | null
          source: string
          source_id: string
          title: string
          url: string
          venue: string
        }
        Insert: {
          city: string
          date_start: string
          id?: string
          last_seen_at?: string | null
          raw_json?: Json | null
          source: string
          source_id: string
          title: string
          url: string
          venue: string
        }
        Update: {
          city?: string
          date_start?: string
          id?: string
          last_seen_at?: string | null
          raw_json?: Json | null
          source?: string
          source_id?: string
          title?: string
          url?: string
          venue?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          content: string
          cover_url: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          title: string
        }
        Insert: {
          content: string
          cover_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          title: string
        }
        Update: {
          content?: string
          cover_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      platform_links: {
        Row: {
          id: string
          platform: Database["public"]["Enums"]["platform_type"]
          release_id: string
          url: string
        }
        Insert: {
          id?: string
          platform: Database["public"]["Enums"]["platform_type"]
          release_id: string
          url: string
        }
        Update: {
          id?: string
          platform?: Database["public"]["Enums"]["platform_type"]
          release_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "platform_links_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      releases: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          published: boolean | null
          release_date: string | null
          slug: string
          title: string
          type: Database["public"]["Enums"]["release_type"]
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          release_date?: string | null
          slug: string
          title: string
          type?: Database["public"]["Enums"]["release_type"]
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          release_date?: string | null
          slug?: string
          title?: string
          type?: Database["public"]["Enums"]["release_type"]
        }
        Relationships: []
      }
      ticket_requests: {
        Row: {
          comment: string | null
          contact: string
          created_at: string | null
          event_id: string | null
          id: string
          name: string
          qty: number | null
          status: string | null
        }
        Insert: {
          comment?: string | null
          contact: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          name: string
          qty?: number | null
          status?: string | null
        }
        Update: {
          comment?: string | null
          contact?: string
          created_at?: string | null
          event_id?: string | null
          id?: string
          name?: string
          qty?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_requests_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          audio_url: string | null
          duration_sec: number | null
          id: string
          order_index: number
          published: boolean | null
          release_id: string
          title: string
        }
        Insert: {
          audio_url?: string | null
          duration_sec?: number | null
          id?: string
          order_index?: number
          published?: boolean | null
          release_id: string
          title: string
        }
        Update: {
          audio_url?: string | null
          duration_sec?: number | null
          id?: string
          order_index?: number
          published?: boolean | null
          release_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracks_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
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
      app_role: "admin" | "user"
      platform_type: "yandex" | "spotify" | "apple" | "youtube"
      release_type: "album" | "single" | "ep"
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
      app_role: ["admin", "user"],
      platform_type: ["yandex", "spotify", "apple", "youtube"],
      release_type: ["album", "single", "ep"],
    },
  },
} as const
