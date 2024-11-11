import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PlusIcon } from 'lucide-react';
import { SubFolder } from '../types';
import FolderGrid from '../components/FolderGrid';

export default function System() {
  const { systemId } = useParams();
  const [folders, setFolders] = useState<SubFolder[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<SubFolder | null>(null);
  const [folderName, setFolderName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolder) {
      setFolders(folders.map(f => 
        f.id === editingFolder.id ? { ...f, name: folderName } : f
      ));
    } else {
      setFolders([...folders, {
        id: Date.now().toString(),
        name: folderName,
        createdAt: new Date(),
        parentId: systemId!,
      }]);
    }
    setIsModalOpen(false);
    setEditingFolder(null);
    setFolderName('');
  };

  const handleEdit = (folder: SubFolder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Sous-catégories</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nouvelle sous-catégorie
        </button>
      </div>

      <FolderGrid
        folders={folders}
        onEdit={handleEdit}
        onDelete={handleDelete}
        basePath={`/system/${systemId}/folder`}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-card-foreground">
              {editingFolder ? 'Modifier la sous-catégorie' : 'Nouvelle sous-catégorie'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nom de la sous-catégorie"
                className="w-full px-3 py-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFolder(null);
                    setFolderName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border border-input rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors"
                >
                  {editingFolder ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}