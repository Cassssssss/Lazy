export interface Folder {
  id: string;
  name: string;
  createdAt: Date;
  description?: string;
  icon?: string;
  bookmarked?: boolean;
}

export interface SubFolder extends Folder {
  parentId: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  type: 'measure' | 'classification';
  folderId: string;
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  bookmarked?: boolean;
  lastViewed?: Date;
}