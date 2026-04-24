export type Category = string;
export type AdStatus = 'active' | 'pending' | 'sold' | 'reported' | 'reserved';
export type Condition = 'Neuf' | 'Très bon état' | 'Bon état' | 'Satisfaisant';

export interface Rating {
  fromUserId: string;
  score: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'student' | 'admin';
  joinDate: string;
  password?: string;
  status?: 'active' | 'suspended' | 'banned';
  ratings?: Rating[];
  favorites?: string[];
  karma: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: 'common' | 'rare' | 'mythic';
}

export interface Ad {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  condition: Condition;
  imageUrl: string;
  userId: string;
  createdAt: string;
  status: AdStatus;
  views: number;
  isService?: boolean;
  watchingCount?: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  adId: string;
  content: string;
  timestamp: string;
}

export interface Stats {
  totalAds: number;
  activeAds: number;
  totalUsers: number;
  reportedAds: number;
  pendingAds: number;
}

export interface PulseEvent {
  id: string;
  type: 'sale' | 'price_drop' | 'new_listing';
  message: string;
  timestamp: string;
}
