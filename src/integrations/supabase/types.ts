export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      holdings: {
        Row: {
          avg_cost: number
          company_name: string
          created_at: string
          id: string
          portfolio_id: string
          purchase_date: string
          sector: string | null
          shares: number
          ticker: string
          updated_at: string
        }
        Insert: {
          avg_cost: number
          company_name: string
          created_at?: string
          id?: string
          portfolio_id: string
          purchase_date: string
          sector?: string | null
          shares: number
          ticker: string
          updated_at?: string
        }
        Update: {
          avg_cost?: number
          company_name?: string
          created_at?: string
          id?: string
          portfolio_id?: string
          purchase_date?: string
          sector?: string | null
          shares?: number
          ticker?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "holdings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      news_articles: {
        Row: {
          created_at: string
          headline: string
          id: string
          published_at: string
          sentiment_score: number | null
          source: string
          summary: string | null
          ticker: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          headline: string
          id?: string
          published_at: string
          sentiment_score?: number | null
          source: string
          summary?: string | null
          ticker?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          headline?: string
          id?: string
          published_at?: string
          sentiment_score?: number | null
          source?: string
          summary?: string | null
          ticker?: string | null
          url?: string | null
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          report_cadence: string | null
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          report_cadence?: string | null
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          report_cadence?: string | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          content: Json
          created_at: string
          generated_at: string
          id: string
          report_type: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: Json
          created_at?: string
          generated_at?: string
          id?: string
          report_type: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          generated_at?: string
          id?: string
          report_type?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trade_ideas: {
        Row: {
          ai_generated: boolean | null
          created_at: string
          id: string
          idea_type: string
          rationale: string
          status: string | null
          target_price: number | null
          ticker: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          created_at?: string
          id?: string
          idea_type: string
          rationale: string
          status?: string | null
          target_price?: number | null
          ticker: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          created_at?: string
          id?: string
          idea_type?: string
          rationale?: string
          status?: string | null
          target_price?: number | null
          ticker?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      valuation_models: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          model_type: string
          results: Json
          target_price: number | null
          ticker: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          model_type: string
          results: Json
          target_price?: number | null
          ticker: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          model_type?: string
          results?: Json
          target_price?: number | null
          ticker?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      watchlist_items: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          notes: string | null
          tags: string[] | null
          ticker: string
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          tags?: string[] | null
          ticker: string
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          tags?: string[] | null
          ticker?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
