export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      folders: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          parent_id?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string
          folder_id: string
          type: 'measure' | 'classification'
          group_id: string | null
          tags: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content: string
          folder_id: string
          type: 'measure' | 'classification'
          group_id?: string | null
          tags?: string[] | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string
          folder_id?: string
          type?: 'measure' | 'classification'
          group_id?: string | null
          tags?: string[] | null
        }
      }
      groups: {
        Row: {
          id: string
          created_at: string
          name: string
          folder_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          folder_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          folder_id?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          created_at: string
          document_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          document_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          document_id?: string
          user_id?: string
        }
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
  }
}