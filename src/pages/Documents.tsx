import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { PlusIcon, FileTextIcon, RulerIcon, ChevronDownIcon, ChevronRightIcon, Edit2Icon, Trash2Icon } from 'lucide-react';
import { Document } from '../types';
import Editor from '../components/Editor';

interface Group {
  id: string;
  name: string;
}

export default function Documents() {
  const { systemId, folderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'measure' | 'classification'>('measure');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [docContent, setDocContent] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('');

  // Mettre à jour le document si on revient de la vue détaillée
  React.useEffect(() => {
    if (location.state?.updatedDocument) {
      setDocuments(docs => 
        docs.map(doc => 
          doc.id === location.state.updatedDocument.id 
            ? location.state.updatedDocument 
            : doc
        )
      );
      // Nettoyer l'état de location pour éviter les mises à jour en boucle
      navigate(location.pathname, { replace: true });
    }
  }, [location.state?.updatedDocument]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingGroup) {
      setGroups(groups.map(g => 
        g.id === editingGroup.id ? { ...g, name: groupName } : g
      ));
    } else {
      setGroups([...groups, {
        id: Date.now().toString(),
        name: groupName,
      }]);
    }
    setIsGroupModalOpen(false);
    setEditingGroup(null);
    setGroupName('');
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setIsGroupModalOpen(true);
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
    setDocuments(documents.map(doc => 
      doc.groupId === groupId ? { ...doc, groupId: undefined } : doc
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: Document = {
      id: Date.now().toString(),
      title: docTitle,
      content: docContent,
      type: activeTab,
      folderId: folderId!,
      groupId: selectedGroup || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedDocs = editingDoc 
      ? documents.map(d => d.id === editingDoc.id ? { ...newDoc, id: d.id } : d)
      : [...documents, newDoc];
    
    setDocuments(updatedDocs);
    setIsModalOpen(false);
    setEditingDoc(null);
    setDocTitle('');
    setDocContent('');
    setSelectedGroup('');

    // Naviguer vers la vue détaillée avec le document
    navigate(`/system/${systemId}/document/${newDoc.id}`, {
      state: { document: newDoc }
    });
  };

  const handleViewDocument = (doc: Document) => {
    navigate(`/system/${systemId}/document/${doc.id}`, {
      state: { document: doc }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Documents</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsGroupModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau groupe
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nouveau document
          </button>
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('measure')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'measure'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <RulerIcon className="h-5 w-5 inline mr-2" />
            Mesures
          </button>
          <button
            onClick={() => setActiveTab('classification')}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'classification'
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileTextIcon className="h-5 w-5 inline mr-2" />
            Classifications
          </button>
        </nav>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="bg-card rounded-lg shadow-md border border-border">
            <div className="px-4 py-3 flex items-center justify-between">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center text-foreground hover:text-primary"
              >
                {expandedGroups.includes(group.id) ? (
                  <ChevronDownIcon className="h-5 w-5 mr-2" />
                ) : (
                  <ChevronRightIcon className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{group.name}</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditGroup(group)}
                  className="p-1 text-muted-foreground hover:text-primary"
                >
                  <Edit2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteGroup(group.id)}
                  className="p-1 text-muted-foreground hover:text-destructive"
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {expandedGroups.includes(group.id) && (
              <div className="p-4 space-y-4 border-t border-border">
                {documents
                  .filter(doc => doc.type === activeTab && doc.groupId === group.id)
                  .map((doc) => (
                    <div 
                      key={doc.id} 
                      className="bg-muted rounded-lg p-4 cursor-pointer hover:bg-muted/80"
                      onClick={() => handleViewDocument(doc)}
                    >
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {doc.title}
                      </h3>
                      <div className="text-sm text-muted-foreground">
                        Dernière modification : {new Date(doc.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}

        {/* Documents sans groupe */}
        <div className="space-y-4">
          {documents
            .filter(doc => doc.type === activeTab && !doc.groupId)
            .map((doc) => (
              <div 
                key={doc.id} 
                className="bg-card rounded-lg p-4 cursor-pointer hover:bg-muted border border-border"
                onClick={() => handleViewDocument(doc)}
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {doc.title}
                </h3>
                <div className="text-sm text-muted-foreground">
                  Dernière modification : {new Date(doc.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modal Groupe */}
      {isGroupModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-md w-full border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {editingGroup ? 'Modifier le groupe' : 'Nouveau groupe'}
            </h2>
            <form onSubmit={handleGroupSubmit} className="space-y-4">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Nom du groupe"
                className="w-full px-3 py-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-primary"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsGroupModalOpen(false);
                    setEditingGroup(null);
                    setGroupName('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border border-input rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                >
                  {editingGroup ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Document */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-border shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              {editingDoc ? 'Modifier le document' : 'Nouveau document'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Titre du document"
                className="w-full px-4 py-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-primary"
                required
              />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-background text-foreground border border-input focus:ring-2 focus:ring-primary"
              >
                <option value="">Sans groupe</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <Editor content={docContent} onChange={setDocContent} />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingDoc(null);
                    setDocTitle('');
                    setDocContent('');
                    setSelectedGroup('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-muted border border-input rounded-md"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md"
                >
                  {editingDoc ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}