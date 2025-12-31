import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Project, Plot, User } from '@/types';
import { sampleProjects } from '@/data/mockData';

interface AppContextType {
  projects: Project[];
  currentProject: Project | null;
  user: User | null;
  isAdmin: boolean;
  setCurrentProject: (project: Project | null) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'plots'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPlot: (projectId: string, plot: Plot) => void;
  updatePlot: (projectId: string, plotId: string, updates: Partial<Plot>) => void;
  deletePlot: (projectId: string, plotId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Demo admin credentials
const ADMIN_EMAIL = 'admin@realestate.com';
const ADMIN_PASSWORD = 'admin123';

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('realestate-projects');
    return saved ? JSON.parse(saved) : sampleProjects;
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('realestate-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('realestate-projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('realestate-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('realestate-user');
    }
  }, [user]);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setUser({ id: '1', email, role: 'admin' });
      return true;
    }
    // Allow any email/password combo for demo viewer access
    if (email && password) {
      setUser({ id: '2', email, role: 'user' });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addProject = (project: Omit<Project, 'id' | 'createdAt' | 'plots'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      plots: [],
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (currentProject?.id === id) {
      setCurrentProject((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }
  };

  const addPlot = (projectId: string, plot: Plot) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, plots: [...p.plots, plot] } : p
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject((prev) =>
        prev ? { ...prev, plots: [...prev.plots, plot] } : null
      );
    }
  };

  const updatePlot = (projectId: string, plotId: string, updates: Partial<Plot>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? {
              ...p,
              plots: p.plots.map((plot) =>
                plot.id === plotId ? { ...plot, ...updates } : plot
              ),
            }
          : p
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject((prev) =>
        prev
          ? {
              ...prev,
              plots: prev.plots.map((plot) =>
                plot.id === plotId ? { ...plot, ...updates } : plot
              ),
            }
          : null
      );
    }
  };

  const deletePlot = (projectId: string, plotId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, plots: p.plots.filter((plot) => plot.id !== plotId) }
          : p
      )
    );
    if (currentProject?.id === projectId) {
      setCurrentProject((prev) =>
        prev
          ? { ...prev, plots: prev.plots.filter((plot) => plot.id !== plotId) }
          : null
      );
    }
  };

  return (
    <AppContext.Provider
      value={{
        projects,
        currentProject,
        user,
        isAdmin: user?.role === 'admin',
        setCurrentProject,
        login,
        logout,
        addProject,
        updateProject,
        deleteProject,
        addPlot,
        updatePlot,
        deletePlot,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
