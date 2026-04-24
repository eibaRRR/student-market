import { Ad, User, Category, Stats, AdStatus, Message } from './types.ts';

// Données initiales si localStorage est vide
const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Thomas Dubois',
    email: 'thomas@etu.fr',
    avatar: 'https://i.pravatar.cc/150?u=u1',
    role: 'student',
    joinDate: '2023-09-01T10:00:00Z',
    password: 'password123',
    karma: 450,
    badges: [
      { id: 'b1', name: 'Pionnier', icon: '🚀', rarity: 'rare' },
      { id: 'b2', name: 'Vendeur Éclair', icon: '⚡', rarity: 'mythic' }
    ]
  },
  {
    id: 'admin1',
    name: 'Admin Principal',
    email: 'admin@univ.fr',
    avatar: 'https://i.pravatar.cc/150?u=admin1',
    role: 'admin',
    joinDate: '2022-01-01T08:00:00Z',
    password: 'admin',
    karma: 1000,
    badges: []
  }
];

const initialAds: Ad[] = [
  {
    id: 'ad1',
    title: 'MacBook Pro M1 2020',
    description: 'Vends MacBook Pro M1 en parfait état. Utilisé uniquement pour les cours. Batterie à 95% de capacité.',
    price: 850,
    category: 'Électronique',
    condition: 'Très bon état',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    userId: 'u1',
    createdAt: '2024-04-20T14:30:00Z',
    status: 'active',
    views: 124,
    watchingCount: 8
  },
  {
    id: 'ad2',
    title: 'Sweat Université',
    description: 'Sweat officiel de l\'université, taille M, jamais porté erreur de taille.',
    price: 15,
    category: 'Vêtements',
    condition: 'Neuf',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-0a63f95609a7?auto=format&fit=crop&q=80&w=800',
    userId: 'u1',
    createdAt: '2024-04-22T16:45:00Z',
    status: 'active',
    views: 89,
    watchingCount: 3
  },
  {
    id: 'ad3',
    title: 'Cours de Soutien Mathématiques',
    description: 'Étudiant en Master de Maths propose cours de soutien pour L1/L2. Algèbre, Analyse, Stats.',
    price: 20,
    category: 'Services',
    condition: 'Bon état', // Not really applicable for services but required by type
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800',
    userId: 'u1',
    createdAt: '2024-04-23T10:00:00Z',
    status: 'active',
    views: 45,
    isService: true,
    watchingCount: 12
  }
];

export let categories: Category[] = loadData('market_categories', ['Livres', 'Électronique', 'Vêtements', 'Logement', 'Services', 'Autre']);
export const conditions: string[] = ['Neuf', 'Très bon état', 'Bon état', 'Satisfaisant'];

export function addCategory(cat: string) {
  if (!categories.includes(cat) && cat.trim() !== '') {
    categories.push(cat.trim());
    saveData('market_categories', categories);
  }
}

export function removeCategory(cat: string) {
  categories = categories.filter(c => c !== cat);
  saveData('market_categories', categories);
}

// Gestion du LocalStorage
export function loadData<T>(key: string, defaultData: T): T {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultData;
}

export function saveData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Variables d'état (sync avec localStorage)
export let users: User[] = loadData('market_users', initialUsers);
export let ads: Ad[] = loadData('market_ads', initialAds);
export let messages: Message[] = loadData('market_messages', []);
export let currentUserId: string | null = loadData('market_current_user', null);

// Hook pour sauvegarder
function persistUsers() { saveData('market_users', users); }
function persistAds() { saveData('market_ads', ads); }
function persistMessages() { saveData('market_messages', messages); }
function persistUser() { saveData('market_current_user', currentUserId); }

// Fonctions Utilisateurs & Auth
export function getCurrentUser() {
  return users.find(u => u.id === currentUserId) || null;
}

export function login(email: string, pass: string): boolean {
  const user = users.find(u => u.email === email && u.password === pass);
  if (user) {
    currentUserId = user.id;
    persistUser();
    return true;
  }
  return false;
}

export function signup(name: string, email: string, pass: string): boolean {
  if (users.find(u => u.email === email)) return false;
  const newUser: User = {
    id: 'u_' + Date.now(),
    name,
    email,
    password: pass,
    avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    role: 'student',
    joinDate: new Date().toISOString(),
    karma: 0,
    badges: []
  };
  users.push(newUser);
  persistUsers();
  currentUserId = newUser.id;
  persistUser();
  return true;
}

export function logout() {
  currentUserId = null;
  persistUser();
}

export function getUserById(id: string) {
  return users.find(u => u.id === id);
}

export function updateUserStatus(id: string, status: 'active' | 'suspended' | 'banned') {
  const user = users.find(u => u.id === id);
  if (user) {
    user.status = status;
    saveData('market_users', users);
  }
}

export function rateUser(targetUserId: string, fromUserId: string, score: number) {
  const user = users.find(u => u.id === targetUserId);
  if (user) {
    if (!user.ratings) user.ratings = [];
    const existing = user.ratings.find(r => r.fromUserId === fromUserId);
    if (existing) existing.score = score;
    else user.ratings.push({ fromUserId, score });
    persistUsers();
    persistUsers();
  }
}

export function toggleFavorite(userId: string, adId: string) {
  const user = users.find(u => u.id === userId);
  if (user) {
    if (!user.favorites) user.favorites = [];
    if (user.favorites.includes(adId)) {
      user.favorites = user.favorites.filter(id => id !== adId);
    } else {
      user.favorites.push(adId);
    }
    persistUsers();
  }
}

export function getUserFavorites(userId: string) {
  const user = users.find(u => u.id === userId);
  if (!user || !user.favorites) return [];
  return ads.filter(ad => user.favorites!.includes(ad.id));
}

export function getMessages(userId1: string, userId2: string, adId: string) {
  return messages.filter(m =>
    m.adId === adId &&
    ((m.senderId === userId1 && m.receiverId === userId2) ||
      (m.senderId === userId2 && m.receiverId === userId1))
  ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

export function sendMessage(senderId: string, receiverId: string, adId: string, content: string) {
  const msg: Message = {
    id: 'msg_' + Date.now(),
    senderId,
    receiverId,
    adId,
    content,
    timestamp: new Date().toISOString()
  };
  messages.push(msg);
  persistMessages();
  return msg;
}

// Fonctions Annonces
export function getAds() {
  return ads.filter(ad => ad.status === 'active');
}

export function getPendingAds() {
  return ads.filter(ad => ad.status === 'pending');
}

export function getAdById(id: string) {
  return ads.find(ad => ad.id === id);
}

export function getUserAds(userId: string) {
  return ads.filter(ad => ad.userId === userId);
}

export function getReportedAds() {
  return ads.filter(ad => ad.status === 'reported');
}

export function addAd(ad: Omit<Ad, 'id' | 'createdAt' | 'status' | 'views'>) {
  const newAd: Ad = {
    ...ad,
    id: `ad${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'pending', // Validation requise par l'admin
    views: 0
  };
  ads = [newAd, ...ads];
  persistAds();
  return newAd;
}

export function deleteAd(id: string) {
  ads = ads.filter(ad => ad.id !== id);
  persistAds();
}

export function updateAdStatus(id: string, status: AdStatus) {
  const ad = ads.find(a => a.id === id);
  if (ad) {
    ad.status = status;
    persistAds();
  }
}

export function editAd(id: string, updates: Partial<Ad>) {
  const ad = ads.find(a => a.id === id);
  if (ad) {
    Object.assign(ad, updates);
    persistAds();
  }
}

export function incrementViews(id: string) {
  const ad = ads.find(a => a.id === id);
  if (ad) {
    ad.views += 1;
    persistAds();
  }
}

export function getStats(): Stats {
  return {
    totalAds: ads.length,
    activeAds: ads.filter(a => a.status === 'active').length,
    totalUsers: users.length,
    reportedAds: ads.filter(a => a.status === 'reported').length,
    pendingAds: ads.filter(a => a.status === 'pending').length,
  };
}

// Pulse Events
const initialPulse: PulseEvent[] = [
  { id: 'p1', type: 'sale', message: 'Un iPhone 13 vient d\'être vendu !', timestamp: new Date().toISOString() },
  { id: 'p2', type: 'price_drop', message: 'Baisse de prix sur "Table de mixage"', timestamp: new Date().toISOString() },
  { id: 'p3', type: 'new_listing', message: 'Nouvelle annonce : "Appartement proche campus"', timestamp: new Date().toISOString() }
];

export let pulseEvents: PulseEvent[] = loadData('market_pulse', initialPulse);

export function addPulseEvent(type: PulseEvent['type'], message: string) {
  const event: PulseEvent = {
    id: 'pulse_' + Date.now(),
    type,
    message,
    timestamp: new Date().toISOString()
  };
  pulseEvents = [event, ...pulseEvents.slice(0, 9)]; // Keep last 10
  saveData('market_pulse', pulseEvents);
}
