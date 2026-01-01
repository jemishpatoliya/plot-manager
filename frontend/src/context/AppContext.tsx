import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import { Project, Plot, User } from '@/types';
import { storeDataUrlImage } from '@/lib/idbImageStore';

interface AppContextType {
  projects: Project[];
  currentProject: Project | null;
  user: User | null;
  isAdmin: boolean;
  setCurrentProject: (project: Project | null) => void;
  register: (email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'plots'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPlot: (projectId: string, plot: Plot) => void;
  updatePlot: (projectId: string, plotId: string, updates: Partial<Plot>) => void;
  deletePlot: (projectId: string, plotId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fixed admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin@123';

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('realestate-projects');
    const parsed = saved ? (JSON.parse(saved) as Project[]) : [];
    const arr = Array.isArray(parsed) ? parsed : [];
    return arr.filter((p) => p?.id !== 'aradhana-business-park');
  });
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [apiAvailable, setApiAvailable] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('realestate-user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const health = await fetch('/api/health');
        if (!health.ok) throw new Error('health not ok');
        const healthJson = (await health.json()) as { dbReady?: boolean };
        if (!healthJson?.dbReady) {
          if (cancelled) return;
          setApiAvailable(false);
          return;
        }
        if (cancelled) return;
        setApiAvailable(true);

        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('projects not ok');
        const data = (await res.json()) as Project[];
        if (cancelled) return;
        if (Array.isArray(data)) {
          setProjects(data);
        }
      } catch {
        if (cancelled) return;
        setApiAvailable(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const didMigrateRef = useRef(false);

  useEffect(() => {
    if (didMigrateRef.current) return;

    const hasDataUrlMap = projects.some((p) => p.mapConfig?.imageUrl?.startsWith('data:image/'));
    if (!hasDataUrlMap) {
      didMigrateRef.current = true;
      return;
    }

    didMigrateRef.current = true;

    (async () => {
      const updated = await Promise.all(
        projects.map(async (p) => {
          const img = p.mapConfig?.imageUrl;
          if (!img || !img.startsWith('data:image/')) return p;

          try {
            const key = `map:${p.id}:${Date.now()}`;
            const ref = await storeDataUrlImage(img, key);
            return { ...p, mapConfig: { ...p.mapConfig!, imageUrl: ref } };
          } catch {
            return p;
          }
        })
      );

      setProjects(updated);
    })();
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('realestate-projects', JSON.stringify(projects));
    } catch {
      // ignore quota errors to avoid crashing the app
    }
  }, [projects]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('realestate-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('realestate-user');
    }
  }, [user]);

  const register = async (email: string, password: string): Promise<boolean> => {
    const e = email.trim().toLowerCase();
    if (!e || !password) return false;

    if (e === ADMIN_EMAIL) return false;

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e, password }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const e = email.trim().toLowerCase();
    if (!e || !password) return false;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: e, password }),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as User;
      if (!data?.email || !data?.role) return false;
      setUser({ id: data.id || (data.role === 'admin' ? '1' : '2'), email: data.email, role: data.role });
      return true;
    } catch {
      return false;
    }
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

    if (apiAvailable) {
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      }).catch(() => {});
    }
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (currentProject?.id === id) {
      setCurrentProject((prev) => (prev ? { ...prev, ...updates } : null));
    }

    if (apiAvailable) {
      fetch(`/api/projects/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        }
      ).catch(() => {});
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (currentProject?.id === id) {
      setCurrentProject(null);
    }

    if (apiAvailable) {
      fetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(() => {});
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

    if (apiAvailable) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj) {
        fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plots: [...proj.plots, plot] }),
        }).catch(() => {});
      }
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

    if (apiAvailable) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj) {
        const nextPlots = proj.plots.map((plot) =>
          plot.id === plotId ? { ...plot, ...updates } : plot
        );
        fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plots: nextPlots }),
        }).catch(() => {});
      }
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

    if (apiAvailable) {
      const proj = projects.find((p) => p.id === projectId);
      if (proj) {
        const nextPlots = proj.plots.filter((plot) => plot.id !== plotId);
        fetch(`/api/projects/${projectId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plots: nextPlots }),
        }).catch(() => {});
      }
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
        register,
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
