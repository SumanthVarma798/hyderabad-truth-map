// Generated from Supabase schema (project: qlprjlcajakswhjlfjrp).
// Regenerate after migrations with:
//   supabase gen types typescript --project-id qlprjlcajakswhjlfjrp > src/types/supabase.ts
// PostGIS function/view signatures are omitted here for readability; the app
// tables below mirror the live schema exactly.

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
      admin_units: {
        Row: {
          id: string
          level: number
          name: string
          parent_id: string | null
          state_code: string
          lgd_code: string | null
          centroid_lat: number | null
          centroid_lng: number | null
          created_at: string
        }
        Insert: {
          id?: string
          level: number
          name: string
          parent_id?: string | null
          state_code: string
          lgd_code?: string | null
          centroid_lat?: number | null
          centroid_lng?: number | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['admin_units']['Insert']>
      }
      admin_level_labels: {
        Row: { state_code: string; level: number; label: string }
        Insert: { state_code: string; level: number; label: string }
        Update: Partial<{ state_code: string; level: number; label: string }>
      }
      contributors: {
        Row: {
          id: string
          auth_user_id: string | null
          tier: 'anonymous' | 'verified' | 'trusted' | 'steward'
          phone_hash: string | null
          accuracy_score: number
          reputation_score: number
          quiz_last_passed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id?: string | null
          tier?: 'anonymous' | 'verified' | 'trusted' | 'steward'
          phone_hash?: string | null
          accuracy_score?: number
          reputation_score?: number
          quiz_last_passed_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['contributors']['Insert']>
      }
      area_stories: {
        Row: {
          id: string
          geo_id: string | null
          admin_unit_id: string | null
          domain: 'infrastructure' | 'land_property' | 'environment'
          status: 'draft' | 'published' | 'resolved' | 'archived'
          narrative_summary: string | null
          confidence_score: number
          opened_at: string
          updated_at: string
          resolved_at: string | null
        }
        Insert: {
          id?: string
          geo_id?: string | null
          admin_unit_id?: string | null
          domain: 'infrastructure' | 'land_property' | 'environment'
          status?: 'draft' | 'published' | 'resolved' | 'archived'
          narrative_summary?: string | null
          confidence_score?: number
          opened_at?: string
          updated_at?: string
          resolved_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['area_stories']['Insert']>
      }
      evidence_items: {
        Row: {
          id: string
          story_id: string
          type: 'citizen_report' | 'satellite' | 'official_record' | 'document'
          source_id: string | null
          contributor_id: string | null
          trust_weight: number
          captured_at: string | null
          payload_url: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          story_id: string
          type: 'citizen_report' | 'satellite' | 'official_record' | 'document'
          source_id?: string | null
          contributor_id?: string | null
          trust_weight?: number
          captured_at?: string | null
          payload_url?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['evidence_items']['Insert']>
      }
      domain_metadata: {
        Row: {
          story_id: string
          domain: 'infrastructure' | 'land_property' | 'environment'
          metadata: Json
        }
        Insert: {
          story_id: string
          domain: 'infrastructure' | 'land_property' | 'environment'
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['domain_metadata']['Insert']>
      }
      reports: {
        Row: {
          id: string
          contributor_id: string | null
          lat: number
          lng: number
          geom: unknown
          photo_url: string | null
          description: string | null
          admin_unit_id: string | null
          status: 'pending' | 'reviewing' | 'verified' | 'disputed' | 'rejected'
          created_at: string
        }
        Insert: {
          id?: string
          contributor_id?: string | null
          lat: number
          lng: number
          photo_url?: string | null
          description?: string | null
          admin_unit_id?: string | null
          status?: 'pending' | 'reviewing' | 'verified' | 'disputed' | 'rejected'
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type PublicSchema = Database['public']
export type Tables<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Row']
export type TablesInsert<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof PublicSchema['Tables']> =
  PublicSchema['Tables'][T]['Update']
