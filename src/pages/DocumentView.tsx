import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Document } from '../types';
import Editor from '../components/Editor';
import { ArrowLeft, Edit2Icon, Trash2Icon, BookmarkIcon } from 'lucide-react';

export default function DocumentView() {
  const { documentId, systemId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(location.state?.document?.title || '');
  const [editedContent, setEditedContent] = useState(location.state?.document?.content || '');
  const document = location.state?.document;

  const handleSave = () => {
    if (!document) return;

    const updatedDoc: Document = {
      ...document,
      title: editedTitle,
      content: editedContent,
      updatedAt: new Date(),
    };

    // Dans un cas réel, ceci serait un appel API pour sauvegarder
    navigate(`/system/${systemId}/folder/${document.folderId}`, {
      state: { updatedDocument: updatedDoc }
    });
  };

  const handleDelete = () => {
    // Dans un cas réel, ceci serait un appel API pour supprimer
    navigate(`/system/${systemId}/folder/${document.folderId}`);
  };

  if (!document) {
    navigate(`/system/${systemId}/folder/${documentId}`);
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate(`/system/${systemId}/folder/${document.folderId}`)}
          className="flex items-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Edit2Icon className="h-4 w-4 mr-2" />
            {isEditing ? 'Annuler' : 'Modifier'}
          </button>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Enregistrer
            </button>
          ) : (
            <>
              <button
                onClick={handleDelete}
                className="flex items-center px-3 py-2 rounded-md bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                <Trash2Icon className="h-4 w-4 mr-2" />
                Supprimer
              </button>
              <button className="flex items-center px-3 py-2 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Favoris
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full px-4 py-2 text-xl font-bold rounded-md border border-input bg-background"
          />
          <Editor content={editedContent} onChange={setEditedContent} />
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-foreground">{document.title}</h1>
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: document.content }}
          />
          <div className="text-sm text-muted-foreground">
            Dernière modification : {new Date(document.updatedAt).toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  );
}