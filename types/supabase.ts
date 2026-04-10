export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: "user" | "admin";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: "user" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          name: string;
          category: "Modern" | "Rustic" | "Minimalist";
          thumbnail_url: string | null;
          demo_url: string | null;
          price_basic: number;
          price_premium: number;
          price_gold: number;
          features: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: "Modern" | "Rustic" | "Minimalist";
          thumbnail_url?: string | null;
          demo_url?: string | null;
          price_basic: number;
          price_premium: number;
          price_gold: number;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: "Modern" | "Rustic" | "Minimalist";
          thumbnail_url?: string | null;
          demo_url?: string | null;
          price_basic?: number;
          price_premium?: number;
          price_gold?: number;
          features?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      invitations: {
        Row: {
          id: string;
          user_id: string;
          template_id: string;
          slug: string;
          package_type: "Basic" | "Premium" | "Gold";
          status: "inactive" | "active" | "expired";
          groom_name: string | null;
          bride_name: string | null;
          is_active: boolean;
          expires_at: string | null;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id: string;
          slug: string;
          package_type: "Basic" | "Premium" | "Gold";
          status?: "inactive" | "active" | "expired";
          groom_name?: string | null;
          bride_name?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string;
          slug?: string;
          package_type?: "Basic" | "Premium" | "Gold";
          status?: "inactive" | "active" | "expired";
          groom_name?: string | null;
          bride_name?: string | null;
          is_active?: boolean;
          expires_at?: string | null;
          views_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_invitation_view_count: {
        Args: { invitation_slug: string };
        Returns: void;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
