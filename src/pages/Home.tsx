import React, { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Folder } from '../types';
import FolderGrid from '../components/FolderGrid';

export default function Home() {
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: '1',
      name: 'Thorax',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Digestif',
      createdAt: new Date(),
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
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
      }]);
    }
    setIsModalOpen(false);
    setEditingFolder(null);
    setFolderName('');
  };

  const handleEdit = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderName(folder.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setFolders(folders.filter(f => f.id !== id));
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Image médicale à gauche */}
      <div className="md:w-1/2 relative">
        <div className="sticky top-24">
          <img
            src="https://images.unsplash.com/photo-1516069677018-378515003435?auto=format&fit=crop&q=80&w=2070"
            alt="Medical X-ray"
            className="rounded-lg shadow-xl opacity-80 dark:opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent rounded-lg" />
          <h2 className="absolute top-8 left-8 text-4xl font-bold text-foreground max-w-md">
            Organisez vos documents radiologiques efficacement
          </h2>
        </div>
      </div>

      {/* Dossiers à droite */}
      <div className="md:w-1/2">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Systèmes</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau système
          </button>
        </div>

        <FolderGrid
          folders={folders}
          onEdit={handleEdit}
          onDelete={handleDelete}
          basePath="/system"
        />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {editingFolder ? 'Modifier le système' : 'Nouveau système'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Nom du système"
                className="w-full px-3 py-2 border rounded-md mb-4 bg-background text-foreground border-input focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingFolder(null);
                    setFolderName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border rounded-md border-input"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
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