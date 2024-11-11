import React from 'react';
import { FileText, Ruler, BookmarkIcon } from 'lucide-react';

interface Document {
  id: string;
  title: string;
  content: string;
  type: 'measure' | 'classification';
}

export default function Bookmarks() {
  const [bookmarks] = React.useState<Document[]>([]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Favoris</h1>

      {bookmarks.length === 0 ? (
        <div className="text-center py-12">
          <BookmarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Aucun favori pour le moment</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookmarks.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {doc.type === 'measure' ? (
                    <Ruler className="h-5 w-5 text-indigo-600 mr-2" />
                  ) : (
                    <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  )}
                  <h3 className="text-lg font-semibold text-gray-900">{doc.title}</h3>
                </div>
                <button
                  onClick={() => {/* Handle remove from bookmarks */}}
                  className="text-gray-400 hover:text-red-600"
                >
                  <BookmarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-2 prose max-w-none" dangerouslySetInnerHTML={{ __html: doc.content }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}