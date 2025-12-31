export type PlotStatus = 'available' | 'booked' | 'sold' | 'mortgaged';

export interface Plot {
  id: string;
  plotNumber: string;
  area: number; // sq. yd
  dimensions: string;
  facing: string;
  price: number;
  status: PlotStatus;
  ownerName?: string;
  saleDate?: string;
  notes?: string;
  // Boundary coordinates (percentage-based for responsiveness)
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  // For irregular shapes, use polygon points
  polygonPoints?: string;
  // Admin can lock overlay position
  isLocked?: boolean;
}

export interface Project {
  id: string;
  name: string;
  location: string;
  description?: string;
  contactDetails?: string;
  layoutImage: string;
  plots: Plot[];
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}
