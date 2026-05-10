// Auto-generated types for Supabase database schema
// Re-run `npx supabase gen types typescript` after schema changes

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "owner" | "writer" | "fan";
export type OrderStatus = "pending" | "completed" | "refunded" | "cancelled";
export type TicketType = "adult" | "concession" | "junior" | "season_pass";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          updated_at?: string;
        };
      };
      fixtures: {
        Row: {
          id: string;
          opponent: string;
          match_date: string;
          kick_off_time: string;
          venue: string;
          is_home: boolean;
          competition: string;
          result: string | null;
          home_score: number | null;
          away_score: number | null;
          tickets_available: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          opponent: string;
          match_date: string;
          kick_off_time: string;
          venue: string;
          is_home: boolean;
          competition: string;
          result?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          tickets_available?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          opponent?: string;
          match_date?: string;
          kick_off_time?: string;
          venue?: string;
          is_home?: boolean;
          competition?: string;
          result?: string | null;
          home_score?: number | null;
          away_score?: number | null;
          tickets_available?: boolean;
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          fixture_id: string | null; // null = season pass (not fixture-specific)
          type: TicketType;
          label: string;
          price_gbp: number; // in pence, e.g. 1500 = £15.00
          availability: number;
          sold_count: number;
          on_sale_at: string | null;
          max_per_order: number;
          description: string | null;
          feature_bullets: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          fixture_id?: string | null;
          type: TicketType;
          label: string;
          price_gbp: number;
          availability?: number;
          sold_count?: number;
          on_sale_at?: string | null;
          max_per_order?: number;
          description?: string | null;
          feature_bullets?: string[];
          created_at?: string;
        };
        Update: {
          fixture_id?: string | null;
          type?: TicketType;
          label?: string;
          price_gbp?: number;
          availability?: number;
          sold_count?: number;
          on_sale_at?: string | null;
          max_per_order?: number;
          description?: string | null;
          feature_bullets?: string[];
        };
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          tier: string;
          logo_url: string | null;
          website_url: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tier: string;
          logo_url?: string | null;
          website_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          tier?: string;
          logo_url?: string | null;
          website_url?: string | null;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      sponsorship_packages: {
        Row: {
          id: string;
          title: string;
          price_label: string;
          billing_period: string;
          benefits: string[];
          featured: boolean;
          contact_email: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          price_label: string;
          billing_period?: string;
          benefits?: string[];
          featured?: boolean;
          contact_email?: string;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          price_label?: string;
          billing_period?: string;
          benefits?: string[];
          featured?: boolean;
          contact_email?: string;
          is_active?: boolean;
          sort_order?: number;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_session_id: string;
          stripe_payment_intent_id: string | null;
          buyer_email: string;
          buyer_name: string | null;
          total_amount_gbp: number; // in pence
          status: OrderStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_session_id: string;
          stripe_payment_intent_id?: string | null;
          buyer_email: string;
          buyer_name?: string | null;
          total_amount_gbp: number;
          status?: OrderStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          stripe_payment_intent_id?: string | null;
          status?: OrderStatus;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          ticket_id: string;
          quantity: number;
          unit_price_gbp: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          ticket_id: string;
          quantity: number;
          unit_price_gbp: number;
          created_at?: string;
        };
        Update: never;
      };
      season_passes: {
        Row: {
          id: string;
          user_id: string;
          order_id: string;
          ticket_id: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          order_id: string;
          ticket_id: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          is_active?: boolean;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          featured_image_url: string | null;
          author_id: string;
          is_published: boolean;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          featured_image_url?: string | null;
          author_id: string;
          is_published?: boolean;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          featured_image_url?: string | null;
          is_published?: boolean;
          published_at?: string | null;
          updated_at?: string;
        };
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      ticket_type: TicketType;
    };
  };
}
