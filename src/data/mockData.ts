import { Project, Plot } from '@/types';
import sampleLayout from '@/assets/sample-layout.png';

export const samplePlots: Plot[] = [
  // Left side merged plots
  { id: '1-2-3', plotNumber: '1+2+3', area: 711.27, dimensions: "131'-0\" x 20'-0\"", facing: 'East', price: 2500000, status: 'sold', ownerName: 'Mr. Sharma', saleDate: '2024-01-15', notes: 'Premium corner plot', bounds: { x: 2, y: 12.5, width: 5.5, height: 13 } },
  { id: '4-5a-5b', plotNumber: '4+5A+5B', area: 796.91, dimensions: "128'-0\" x 25'-0\"", facing: 'East', price: 2800000, status: 'booked', ownerName: 'Mrs. Patel', notes: 'Large merged plot', bounds: { x: 2, y: 25.5, width: 5.5, height: 10 } },
  
  // Top row plots (6-23)
  { id: '6', plotNumber: '6', area: 199.65, dimensions: "17'-0\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 10, y: 30, width: 3.5, height: 6 } },
  { id: '7', plotNumber: '7', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 13.5, y: 30, width: 3.5, height: 6 } },
  { id: '8', plotNumber: '8', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'sold', ownerName: 'Mr. Kumar', saleDate: '2024-02-20', bounds: { x: 17, y: 30, width: 3.5, height: 6 } },
  { id: '9', plotNumber: '9', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 20.5, y: 30, width: 3.5, height: 6 } },
  { id: '10', plotNumber: '10', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'booked', bounds: { x: 24, y: 30, width: 3.5, height: 6 } },
  { id: '11', plotNumber: '11', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 27.5, y: 30, width: 3.5, height: 6 } },
  { id: '12', plotNumber: '12', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 31, y: 30, width: 3.5, height: 6 } },
  { id: '13', plotNumber: '13', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'mortgaged', bounds: { x: 34.5, y: 30, width: 3.5, height: 6 } },
  { id: '14', plotNumber: '14', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 38, y: 30, width: 3.5, height: 6 } },
  { id: '15', plotNumber: '15', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 41.5, y: 30, width: 3.5, height: 6 } },
  { id: '16', plotNumber: '16', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'sold', ownerName: 'Dr. Mehta', saleDate: '2024-03-10', bounds: { x: 45, y: 30, width: 3.5, height: 6 } },
  { id: '17', plotNumber: '17', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 48.5, y: 30, width: 3.5, height: 6 } },
  { id: '18', plotNumber: '18', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 52, y: 30, width: 3.5, height: 6 } },
  { id: '19', plotNumber: '19', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'booked', bounds: { x: 55.5, y: 30, width: 3.5, height: 6 } },
  { id: '20', plotNumber: '20', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 59, y: 30, width: 3.5, height: 6 } },
  { id: '21', plotNumber: '21', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 62.5, y: 30, width: 3.5, height: 6 } },
  { id: '22', plotNumber: '22', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'sold', ownerName: 'Mr. Singh', saleDate: '2024-04-05', bounds: { x: 66, y: 30, width: 3.5, height: 6 } },
  { id: '23', plotNumber: '23', area: 199.65, dimensions: "16'-5\" x 10'-5\"", facing: 'South', price: 850000, status: 'available', bounds: { x: 69.5, y: 30, width: 3.5, height: 6 } },
  
  // Right side plots (24-31)
  { id: '24', plotNumber: '24', area: 236.98, dimensions: "18'-5\" x 10'-5\"", facing: 'West', price: 950000, status: 'available', bounds: { x: 76, y: 30, width: 3.5, height: 6 } },
  { id: '25', plotNumber: '25', area: 236.98, dimensions: "18'-5\" x 10'-5\"", facing: 'West', price: 950000, status: 'booked', bounds: { x: 79.5, y: 30, width: 3.5, height: 6 } },
  { id: '26', plotNumber: '26', area: 236.98, dimensions: "18'-5\" x 10'-5\"", facing: 'West', price: 950000, status: 'available', bounds: { x: 83, y: 30, width: 3.5, height: 6 } },
  { id: '27', plotNumber: '27', area: 236.98, dimensions: "18'-5\" x 10'-5\"", facing: 'West', price: 950000, status: 'available', bounds: { x: 86.5, y: 30, width: 3.5, height: 6 } },
  { id: '28', plotNumber: '28', area: 236.98, dimensions: "17'-9\" x 10'-5\"", facing: 'West', price: 950000, status: 'sold', ownerName: 'Mrs. Gupta', saleDate: '2024-05-12', bounds: { x: 90, y: 30, width: 3.5, height: 6 } },
  { id: '29', plotNumber: '29', area: 236.98, dimensions: "17'-9\" x 10'-5\"", facing: 'North-West', price: 980000, status: 'available', bounds: { x: 93.5, y: 30, width: 3.5, height: 6 } },
  
  // Bottom row plots (56-37, right to left)
  { id: '56', plotNumber: '56', area: 195.62, dimensions: "18'-5\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 10, y: 55, width: 3.5, height: 6 } },
  { id: '55', plotNumber: '55', area: 195.13, dimensions: "18'-5\" x 10'-5\"", facing: 'North', price: 820000, status: 'sold', ownerName: 'Mr. Verma', saleDate: '2024-06-20', bounds: { x: 13.5, y: 55, width: 3.5, height: 6 } },
  { id: '54', plotNumber: '54', area: 194.66, dimensions: "18'-8\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 17, y: 55, width: 3.5, height: 6 } },
  { id: '53', plotNumber: '53', area: 194.17, dimensions: "19'-0\" x 10'-5\"", facing: 'North', price: 820000, status: 'booked', bounds: { x: 20.5, y: 55, width: 3.5, height: 6 } },
  { id: '52', plotNumber: '52', area: 193.68, dimensions: "19'-5\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 24, y: 55, width: 3.5, height: 6 } },
  { id: '51', plotNumber: '51', area: 193.18, dimensions: "18'-7\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 27.5, y: 55, width: 3.5, height: 6 } },
  { id: '50', plotNumber: '50', area: 192.69, dimensions: "18'-4\" x 10'-5\"", facing: 'North', price: 820000, status: 'mortgaged', bounds: { x: 31, y: 55, width: 3.5, height: 6 } },
  { id: '49', plotNumber: '49', area: 192.22, dimensions: "18'-0\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 34.5, y: 55, width: 3.5, height: 6 } },
  { id: '48', plotNumber: '48', area: 191.73, dimensions: "18'-3\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 38, y: 55, width: 3.5, height: 6 } },
  { id: '47', plotNumber: '47', area: 191.24, dimensions: "19'-0\" x 10'-5\"", facing: 'North', price: 820000, status: 'sold', ownerName: 'Dr. Joshi', saleDate: '2024-07-01', bounds: { x: 41.5, y: 55, width: 3.5, height: 6 } },
  { id: '46', plotNumber: '46', area: 190.75, dimensions: "18'-6\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 45, y: 55, width: 3.5, height: 6 } },
  { id: '45', plotNumber: '45', area: 190.25, dimensions: "12'-6\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 48.5, y: 55, width: 3.5, height: 6 } },
  { id: '44', plotNumber: '44', area: 189.78, dimensions: "12'-6\" x 10'-5\"", facing: 'North', price: 820000, status: 'booked', bounds: { x: 52, y: 55, width: 3.5, height: 6 } },
  { id: '43', plotNumber: '43', area: 189.29, dimensions: "18'-8\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 55.5, y: 55, width: 3.5, height: 6 } },
  { id: '42', plotNumber: '42', area: 188.8, dimensions: "18'-5\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 59, y: 55, width: 3.5, height: 6 } },
  { id: '41', plotNumber: '41', area: 188.31, dimensions: "18'-5\" x 10'-5\"", facing: 'North', price: 820000, status: 'sold', ownerName: 'Mrs. Desai', saleDate: '2024-08-15', bounds: { x: 62.5, y: 55, width: 3.5, height: 6 } },
  { id: '40', plotNumber: '40', area: 187.81, dimensions: "18'-2\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 66, y: 55, width: 3.5, height: 6 } },
  { id: '39', plotNumber: '39', area: 187.32, dimensions: "19'-2\" x 10'-5\"", facing: 'North', price: 820000, status: 'available', bounds: { x: 69.5, y: 55, width: 3.5, height: 6 } },
  { id: '38', plotNumber: '38', area: 188.05, dimensions: "18'-2\" x 10'-5\"", facing: 'North', price: 820000, status: 'booked', bounds: { x: 73, y: 55, width: 3.5, height: 6 } },
  { id: '37', plotNumber: '37', area: 190.46, dimensions: "17'-0\" x 10'-5\"", facing: 'North', price: 850000, status: 'available', bounds: { x: 76.5, y: 55, width: 3.5, height: 6 } },
  
  // Right side bottom plots (36-32/A)
  { id: '36', plotNumber: '36', area: 222.44, dimensions: "17'-0\" x 10'-5\"", facing: 'North-East', price: 900000, status: 'available', bounds: { x: 80, y: 55, width: 3.5, height: 6 } },
  { id: '35', plotNumber: '35', area: 225.03, dimensions: "17'-9\" x 10'-5\"", facing: 'North-East', price: 920000, status: 'sold', ownerName: 'Mr. Agarwal', saleDate: '2024-09-01', bounds: { x: 83.5, y: 55, width: 3.5, height: 6 } },
  { id: '34', plotNumber: '34', area: 227.63, dimensions: "17'-9\" x 10'-5\"", facing: 'North-East', price: 940000, status: 'available', bounds: { x: 87, y: 55, width: 3.5, height: 6 } },
  { id: '33', plotNumber: '33', area: 230.23, dimensions: "17'-0\" x 10'-5\"", facing: 'North-East', price: 960000, status: 'available', bounds: { x: 90.5, y: 55, width: 3.5, height: 6 } },
  { id: '32A', plotNumber: '32/A', area: 236.98, dimensions: "32'-8\" x 10'-5\"", facing: 'East', price: 1100000, status: 'mortgaged', bounds: { x: 94, y: 50, width: 4, height: 8 } },
  { id: '32B', plotNumber: '32/B', area: 236.43, dimensions: "32'-8\" x 10'-5\"", facing: 'South-East', price: 1200000, status: 'available', bounds: { x: 94, y: 72, width: 4, height: 8 } },
  
  // Left side bottom merged plots
  { id: '57a-57b-58', plotNumber: '57A/B+58', area: 654.51, dimensions: "107'-2\" x 45'-5\"", facing: 'East', price: 2200000, status: 'available', bounds: { x: 2, y: 50, width: 6, height: 12 } },
  { id: '59-60a-60b', plotNumber: '59+60A/B', area: 805.69, dimensions: "59'-6\" x 45'-5\"", facing: 'East', price: 2600000, status: 'booked', ownerName: 'Mr. Kapoor', notes: 'Payment in progress', bounds: { x: 2, y: 62, width: 6, height: 16 } },
];

export const sampleProjects: Project[] = [
  {
    id: 'aradhana-business-park',
    name: 'Aradhana Business Park',
    location: 'Moje-Kumbhariya, TP 35, FP 48',
    description: 'Premium commercial and residential plots',
    contactDetails: '+91 98765 43210',
    layoutImage: sampleLayout,
    plots: samplePlots,
    createdAt: '2024-01-01',
  },
];
