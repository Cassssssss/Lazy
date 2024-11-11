import { supabase } from './supabase';
import type { Database } from '../types/supabase';

type Folder = Database['public']['Tables']['folders']['Row'];
type Document = Database['public']['Tables']['documents']['Row'];
type Group = Database['public']['Tables']['groups']['Row'];

// Folders
export async function getFolders(parentId: string | null = null) {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createFolder(folder: Database['public']['Tables']['folders']['Insert']) {
  const { data, error } = await supabase
    .from('folders')
    .insert(folder)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateFolder(id: string, updates: Database['public']['Tables']['folders']['Update']) {
  const { data, error } = await supabase
    .from('folders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteFolder(id: string) {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Documents
export async function getDocuments(folderId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('folder_id', folderId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function createDocument(document: Database['public']['Tables']['documents']['Insert']) {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDocument(id: string, updates: Database['public']['Tables']['documents']['Update']) {
  const { data, error } = await supabase
    .from('documents')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Groups
export async function getGroups(folderId: string) {
  const { data, error } = await supabase
    .from('groups')
    .select('*')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createGroup(group: Database['public']['Tables']['groups']['Insert']) {
  const { data, error } = await supabase
    .from('groups')
    .insert(group)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateGroup(id: string, updates: Database['public']['Tables']['groups']['Update']) {
  const { data, error } = await supabase
    .from('groups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteGroup(id: string) {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Bookmarks
export async function toggleBookmark(documentId: string, userId: string) {
  const { data: existingBookmark } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', userId)
    .single();

  if (existingBookmark) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('id', existingBookmark.id);

    if (error) throw error;
    return false;
  } else {
    const { error } = await supabase
      .from('bookmarks')
      .insert({ document_id: documentId, user_id: userId });

    if (error) throw error;
    return true;
  }
}