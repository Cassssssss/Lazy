import React, { useState, useEffect } from 'react';
import { 
  Moon, 
  Sun, 
  Bell, 
  Eye, 
  Lock,
  Settings2Icon
} from 'lucide-react';

export default function Settings() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'medium');
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Paramètres</h1>

      <div className="space-y-6">
        {/* Apparence */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Apparence</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-card-foreground">Thème</label>
              <div className="mt-2 flex space-x-2">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'light'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Sun className="h-5 w-5 mr-2" />
                  Clair
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    theme === 'dark'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Moon className="h-5 w-5 mr-2" />
                  Sombre
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-card-foreground">Taille du texte</label>
              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-input focus:ring-2 focus:ring-primary focus:border-primary rounded-md bg-background text-foreground"
              >
                <option value="small">Petit</option>
                <option value="medium">Moyen</option>
                <option value="large">Grand</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Notifications</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-sm text-card-foreground">Activer les notifications</span>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                notifications ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sauvegarde */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Sauvegarde</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Eye className="h-5 w-5 text-muted-foreground mr-2" />
              <span className="text-sm text-card-foreground">Sauvegarde automatique</span>
            </div>
            <button
              onClick={() => setAutoSave(!autoSave)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSave ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Sécurité */}
        <div className="bg-card rounded-lg shadow-md p-6 border border-border">
          <h2 className="text-lg font-medium text-card-foreground mb-4">Sécurité</h2>
          
          <button className="flex items-center text-sm text-card-foreground hover:text-primary">
            <Lock className="h-5 w-5 mr-2" />
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}