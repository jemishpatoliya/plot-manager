import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Building2, LogIn, LogOut, User, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const { user, isAdmin, logout, currentProject, setCurrentProject } = useApp();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Breadcrumb */}
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            onClick={() => setCurrentProject(null)}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg hidden sm:inline">PlotManager</span>
          </Link>

          {currentProject && (
            <>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium truncate max-w-[200px]">
                {currentProject.name}
              </span>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
                {isAdmin && (
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/20 text-primary">
                    Admin
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
