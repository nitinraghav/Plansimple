export interface User {
  uid: string;
  email: string;
}

export interface Entry {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  category: 'personal' | 'legal' | 'digital' | 'wishes';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export type Category = 'personal' | 'legal' | 'digital' | 'wishes';

export interface CategoryInfo {
  id: Category;
  title: string;
  description: string;
  icon: string;
} 