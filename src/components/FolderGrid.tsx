import React from 'react';
import { Folder, SubFolder } from '../types';
import { FolderIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FolderGridProps {
  folders: (Folder | SubFolder)[];
  onEdit: (folder: Folder | SubFolder) => void;
  onDelete: (id: string) => void;
  basePath: string;
}

export default function FolderGrid({ folders, onEdit, onDelete, basePath }: FolderGridProps) {
  return (
    <div className="space-y-2">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="bg-card rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-border group hover:border-primary/50"
        >
          <Link to={`${basePath}/${folder.id}`}>
            <div className="p-4 cursor-pointer">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mr-4 group-hover:bg-primary/20 transition-colors">
                  <FolderIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
                    {folder.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Créé le {new Date(folder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="ml-auto flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onEdit(folder);
                    }}
                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                  >
                    <Edit2Icon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(folder.id);
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}