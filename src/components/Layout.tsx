import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Stethoscope,
  HomeIcon, 
  SearchIcon, 
  BookmarkIcon, 
  Settings2Icon, 
  MenuIcon, 
  XIcon,
  FileTextIcon,
  FolderIcon
} from 'lucide-react';
import { Folder, Document } from '../types';

interface SearchResult {
  type: 'folder' | 'document';
  id: string;
  title: string;
  path: string;
  systemName?: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
  // Simuler une base de données de systèmes et documents
  const systems: Folder[] = [
    { id: '1', name: 'Thorax', createdAt: new Date() },
    { id: '2', name: 'Digestif', createdAt: new Date() }
  ];

  const documents: Document[] = [
    {
      id: '1',
      title: 'Radiographie pulmonaire',
      content: '',
      type: 'measure',
      folderId: '1',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Ajoutez plus de documents si nécessaire
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Recherche dans les systèmes
    systems.forEach(system => {
      if (system.name.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'folder',
          id: system.id,
          title: system.name,
          path: `/system/${system.id}`
        });
      }
    });

    // Recherche dans les documents
    documents.forEach(doc => {
      if (
        doc.title.toLowerCase().includes(searchTerm) ||
        doc.content.toLowerCase().includes(searchTerm)
      ) {
        const system = systems.find(s => s.id === doc.folderId);
        results.push({
          type: 'document',
          id: doc.id,
          title: doc.title,
          path: `/system/${doc.folderId}/document/${doc.id}`,
          systemName: system?.name
        });
      }
    });

    setSearchResults(results);
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.path);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <Stethoscope className="h-8 w-8 text-primary-foreground" />
                <span className="ml-2 text-2xl font-bold text-primary-foreground hidden md:block">Lazy</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-64 px-4 py-2 pl-10 pr-4 rounded-md border bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <SearchIcon className="h-5 w-5 text-primary-foreground/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                
                {/* Résultats de recherche */}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-md shadow-lg border border-border overflow-hidden">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-2"
                      >
                        {result.type === 'folder' ? (
                          <FolderIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <FileTextIcon className="h-4 w-4 text-primary" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {result.title}
                          </div>
                          {result.systemName && (
                            <div className="text-xs text-muted-foreground">
                              {result.systemName}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Link
                to="/bookmarks"
                className="p-2 text-primary-foreground/80 hover:text-primary-foreground rounded-md"
                title="Favoris"
              >
                <BookmarkIcon className="h-5 w-5" />
              </Link>
              <Link
                to="/settings"
                className="p-2 text-primary-foreground/80 hover:text-primary-foreground rounded-md"
                title="Paramètres"
              >
                <Settings2Icon className="h-5 w-5" />
              </Link>
              <Link
                to="/"
                className={`p-2 rounded-md ${
                  location.pathname === '/'
                    ? 'text-primary-foreground'
                    : 'text-primary-foreground/80 hover:text-primary-foreground'
                }`}
                title="Accueil"
              >
                <HomeIcon className="h-5 w-5" />
              </Link>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-primary-foreground/80 hover:text-primary-foreground rounded-md"
              >
                <SearchIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-primary-foreground/80 hover:text-primary-foreground rounded-md"
              >
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div className="md:hidden py-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-4 py-2 pl-10 rounded-md border bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 border-primary-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
                />
                <SearchIcon className="h-5 w-5 text-primary-foreground/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                
                {/* Résultats de recherche mobile */}
                {searchResults.length > 0 && searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-md shadow-lg border border-border overflow-hidden">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        className="w-full px-4 py-2 text-left hover:bg-muted flex items-center space-x-2"
                      >
                        {result.type === 'folder' ? (
                          <FolderIcon className="h-4 w-4 text-primary" />
                        ) : (
                          <FileTextIcon className="h-4 w-4 text-primary" />
                        )}
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {result.title}
                          </div>
                          {result.systemName && (
                            <div className="text-xs text-muted-foreground">
                              {result.systemName}
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-foreground/10 border-t border-primary-foreground/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === '/' ? 'bg-primary-foreground/20 text-primary-foreground' : 'text-primary-foreground/80'
                }`}
              >
                <HomeIcon className="h-5 w-5 inline mr-2" />
                Accueil
              </Link>
              <Link
                to="/bookmarks"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/80"
              >
                <BookmarkIcon className="h-5 w-5 inline mr-2" />
                Favoris
              </Link>
              <Link
                to="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-primary-foreground/80"
              >
                <Settings2Icon className="h-5 w-5 inline mr-2" />
                Paramètres
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2">
        <Link
          to="/"
          className={`p-2 ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <HomeIcon className="h-6 w-6" />
        </Link>
        <Link
          to="/bookmarks"
          className="p-2 text-muted-foreground"
        >
          <BookmarkIcon className="h-6 w-6" />
        </Link>
        <Link
          to="/settings"
          className="p-2 text-muted-foreground"
        >
          <Settings2Icon className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
}