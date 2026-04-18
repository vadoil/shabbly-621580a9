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
      artist_media: {
        Row: {
          artist_id: string
          caption: string | null
          created_at: string
          id: string
          sort_order: number
          type: string
          url: string
        }
        Insert: {
          artist_id: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          type: string
          url: string
        }
        Update: {
          artist_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          sort_order?: number
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_media_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artists: {
        Row: {
          bio: string | null
          cities: string[]
          created_at: string
          featured: boolean
          formats: string[]
          genres: string[]
          id: string
          name: string
          photo_url: string | null
          popularity: number
          price_max: number | null
          price_min: number | null
          published: boolean
          rider: string | null
          short_description: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string | null
          cities?: string[]
          created_at?: string
          featured?: boolean
          formats?: string[]
          genres?: string[]
          id?: string
          name: string
          photo_url?: string | null
          popularity?: number
          price_max?: number | null
          price_min?: number | null
          published?: boolean
          rider?: string | null
          short_description?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string | null
          cities?: string[]
          created_at?: string
          featured?: boolean
          formats?: string[]
          genres?: string[]
          id?: string
          name?: string
          photo_url?: string | null
          popularity?: number
          price_max?: number | null
          price_min?: number | null
          published?: boolean
          rider?: string | null
          short_description?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      band_members: {
        Row: {
          id: string
          name: string
          photo_url: string | null
          published: boolean | null
          role: string
          sort_order: number
        }
        Insert: {
          id?: string
          name: string
          photo_url?: string | null
          published?: boolean | null
          role?: string
          sort_order?: number
        }
        Update: {
          id?: string
          name?: string
          photo_url?: string | null
          published?: boolean | null
          role?: string
          sort_order?: number
        }
        Relationships: []
      }
      bar_events: {
        Row: {
          bar_id: string
          date_start: string
          description: string | null
          hall: string | null
          id: string
          last_synced_at: string | null
          published: boolean | null
          source_url: string | null
          ticket_url: string | null
          title: string
        }
        Insert: {
          bar_id: string
          date_start: string
          description?: string | null
          hall?: string | null
          id?: string
          last_synced_at?: string | null
          published?: boolean | null
          source_url?: string | null
          ticket_url?: string | null
          title: string
        }
        Update: {
          bar_id?: string
          date_start?: string
          description?: string | null
          hall?: string | null
          id?: string
          last_synced_at?: string | null
          published?: boolean | null
          source_url?: string | null
          ticket_url?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "bar_events_bar_id_fkey"
            columns: ["bar_id"]
            isOneToOne: false
            referencedRelation: "bars"
            referencedColumns: ["id"]
          },
        ]
      }
      bar_events_external: {
        Row: {
          city: string
          date_start: string
          date_text_raw: string | null
          id: string
          last_seen_at: string | null
          source: string
          source_id: string
          title: string
          url: string
          venue_id: string
        }
        Insert: {
          city?: string
          date_start: string
          date_text_raw?: string | null
          id?: string
          last_seen_at?: string | null
          source: string
          source_id: string
          title: string
          url: string
          venue_id: string
        }
        Update: {
          city?: string
          date_start?: string
          date_text_raw?: string | null
          id?: string
          last_seen_at?: string | null
          source?: string
          source_id?: string
          title?: string
          url?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bar_events_external_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues_external"
            referencedColumns: ["id"]
          },
        ]
      }
      bars: {
        Row: {
          address: string | null
          city: string
          id: string
          name: string
          phone: string | null
          published: boolean | null
          slug: string
          website_url: string | null
        }
        Insert: {
          address?: string | null
          city?: string
          id?: string
          name: string
          phone?: string | null
          published?: boolean | null
          slug: string
          website_url?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          id?: string
          name?: string
          phone?: string | null
          published?: boolean | null
          slug?: string
          website_url?: string | null
        }
        Relationships: []
      }
      case_artists: {
        Row: {
          artist_id: string
          case_id: string
        }
        Insert: {
          artist_id: string
          case_id: string
        }
        Update: {
          artist_id?: string
          case_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_artists_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_artists_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          city: string | null
          client: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          event_date: string | null
          featured: boolean
          format: string | null
          gallery: Json
          id: string
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          city?: string | null
          client?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          featured?: boolean
          format?: string | null
          gallery?: Json
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          city?: string | null
          client?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          event_date?: string | null
          featured?: boolean
          format?: string | null
          gallery?: Json
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_inquiries: {
        Row: {
          artist_id: string | null
          budget: string | null
          city: string | null
          comment: string | null
          company: string | null
          contact: string
          created_at: string
          event_date: string | null
          format: string | null
          id: string
          name: string
          status: string
        }
        Insert: {
          artist_id?: string | null
          budget?: string | null
          city?: string | null
          comment?: string | null
          company?: string | null
          contact: string
          created_at?: string
          event_date?: string | null
          format?: string | null
          id?: string
          name: string
          status?: string
        }
        Update: {
          artist_id?: string | null
          budget?: string | null
          city?: string | null
          comment?: string | null
          company?: string | null
          contact?: string
          created_at?: string
          event_date?: string | null
          format?: string | null
          id?: string
          name?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_inquiries_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
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
      gallery_albums: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          published: boolean | null
          slug: string
          sort_order: number | null
          title: string
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string | null
          featured: boolean
          id: string
          image_url: string
          published: boolean | null
          sort_order: number | null
          source: string | null
          source_id: string | null
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string | null
          featured?: boolean
          id?: string
          image_url: string
          published?: boolean | null
          sort_order?: number | null
          source?: string | null
          source_id?: string | null
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string | null
          featured?: boolean
          id?: string
          image_url?: string
          published?: boolean | null
          sort_order?: number | null
          source?: string | null
          source_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      merch_products: {
        Row: {
          category: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          id: string
          price_text: string | null
          published: boolean | null
          slug: string
          sort_order: number | null
          title: string
        }
        Insert: {
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          price_text?: string | null
          published?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
        }
        Update: {
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          price_text?: string | null
          published?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: []
      }
      merch_requests: {
        Row: {
          comment: string | null
          contact: string
          created_at: string | null
          id: string
          name: string
          product_id: string | null
          status: string | null
        }
        Insert: {
          comment?: string | null
          contact: string
          created_at?: string | null
          id?: string
          name: string
          product_id?: string | null
          status?: string | null
        }
        Update: {
          comment?: string | null
          contact?: string
          created_at?: string | null
          id?: string
          name?: string
          product_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merch_requests_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merch_products"
            referencedColumns: ["id"]
          },
        ]
      }
      merch_variants: {
        Row: {
          color: string | null
          id: string
          in_stock: boolean | null
          product_id: string
          size: string | null
          sku: string | null
        }
        Insert: {
          color?: string | null
          id?: string
          in_stock?: boolean | null
          product_id: string
          size?: string | null
          sku?: string | null
        }
        Update: {
          color?: string | null
          id?: string
          in_stock?: boolean | null
          product_id?: string
          size?: string | null
          sku?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "merch_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "merch_products"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          content: string
          cover_url: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          source: string | null
          source_id: string | null
          title: string
        }
        Insert: {
          content: string
          cover_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          source?: string | null
          source_id?: string | null
          title: string
        }
        Update: {
          content?: string
          cover_url?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          source?: string | null
          source_id?: string | null
          title?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          id: string
          logo_url: string | null
          name: string
          published: boolean | null
          sort_order: number
          url: string | null
        }
        Insert: {
          id?: string
          logo_url?: string | null
          name: string
          published?: boolean | null
          sort_order?: number
          url?: string | null
        }
        Update: {
          id?: string
          logo_url?: string | null
          name?: string
          published?: boolean | null
          sort_order?: number
          url?: string | null
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
          featured: boolean
          id: string
          published: boolean | null
          release_date: string | null
          slug: string
          source: string | null
          source_id: string | null
          title: string
          type: Database["public"]["Enums"]["release_type"]
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean
          id?: string
          published?: boolean | null
          release_date?: string | null
          slug: string
          source?: string | null
          source_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["release_type"]
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          featured?: boolean
          id?: string
          published?: boolean | null
          release_date?: string | null
          slug?: string
          source?: string | null
          source_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["release_type"]
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          packages: Json
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          packages?: Json
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          packages?: Json
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_sections: {
        Row: {
          content: string
          id: string
          key: string
          published: boolean | null
          title: string
        }
        Insert: {
          content?: string
          id?: string
          key: string
          published?: boolean | null
          title?: string
        }
        Update: {
          content?: string
          id?: string
          key?: string
          published?: boolean | null
          title?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          id: string
          name: string
          order_index: number | null
          photo_url: string | null
          published: boolean | null
          role: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name: string
          order_index?: number | null
          photo_url?: string | null
          published?: boolean | null
          role?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          id?: string
          name?: string
          order_index?: number | null
          photo_url?: string | null
          published?: boolean | null
          role?: string | null
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
      track_links: {
        Row: {
          id: string
          platform: string
          track_id: string
          url: string
        }
        Insert: {
          id?: string
          platform: string
          track_id: string
          url: string
        }
        Update: {
          id?: string
          platform?: string
          track_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "track_links_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
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
      venues_external: {
        Row: {
          address: string | null
          id: string
          last_seen_at: string | null
          metro: string | null
          name: string
          source: string
          source_id: string
          url: string
        }
        Insert: {
          address?: string | null
          id?: string
          last_seen_at?: string | null
          metro?: string | null
          name: string
          source: string
          source_id: string
          url: string
        }
        Update: {
          address?: string | null
          id?: string
          last_seen_at?: string | null
          metro?: string | null
          name?: string
          source?: string
          source_id?: string
          url?: string
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
