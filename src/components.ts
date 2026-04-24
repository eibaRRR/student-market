import { Ad } from './types.ts';
import { formatPrice, formatDate } from './utils.ts';
import { getUserById, getCurrentUser, pulseEvents } from './store.ts';

export function createAdCard(ad: Ad): string {
  const user = getUserById(ad.userId);
  const currentUser = getCurrentUser();
  const isFav = currentUser?.favorites?.includes(ad.id);
  const conditionBadgeClass = getConditionBadgeClass(ad.condition);
  const karmaClass = user ? getKarmaClass(user.karma) : '';
  const isService = ad.isService;

  return `
    <div class="ad-card group ${karmaClass} relative" onclick="window.router.navigate('details', { id: '${ad.id}' })">
      ${user && user.karma > 500 ? '<div class="absolute -top-1 -left-1 w-full h-full rounded-2xl bg-gradient-to-br from-[#0047FF]/10 to-[#8000FF]/10 blur-xl -z-10 group-hover:opacity-100 opacity-0 transition-opacity"></div>' : ''}
      
      <div class="ad-card-img-container relative">
        <img src="${ad.imageUrl}" alt="${ad.title}" class="ad-card-img" onerror="this.src='https://via.placeholder.com/400x300?text=Image+non+disponible'">
        
        <!-- Demand Indicator (Neo-Digitalism Pulse) -->
        ${ad.watchingCount && ad.watchingCount > 5 ? `
          <div class="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-2 z-10 border border-white/10">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span class="text-[10px] font-bold text-white uppercase tracking-tighter">${ad.watchingCount} en ligne</span>
          </div>
        ` : ''}

        <button data-fav="${ad.id}" class="btn-fav absolute top-3 left-3 bg-white/80 dark:bg-black/50 p-2 rounded-full shadow-md hover:scale-110 transition-transform z-10" onclick="window.handleFavoriteClick(event, '${ad.id}', this)">
          <svg class="w-5 h-5 ${isFav ? 'fill-current text-red-500' : 'text-gray-400 dark:text-gray-500'}" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <div class="absolute top-3 right-3 flex space-x-2 z-10">
          <span class="badge glass text-sm font-bold text-slate-900 border-none shadow-lg">${formatPrice(ad.price)}</span>
        </div>
      </div>
      
      <div class="ad-card-content">
        <div class="flex justify-between items-start mb-3">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black uppercase tracking-widest text-primary-500">${ad.category}</span>
            ${isService ? '<span class="text-[9px] bg-[#8000FF]/20 text-[#8000FF] px-1.5 py-0.5 rounded border border-[#8000FF]/30 w-fit font-bold uppercase">Service</span>' : ''}
          </div>
          <span class="badge ${conditionBadgeClass}">${ad.condition}</span>
        </div>
        <h3 class="font-display font-bold text-xl text-slate-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-primary-500 transition-colors">${ad.title}</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">${ad.description}</p>
        
        <div class="mt-auto flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/50">
          <div class="relative">
             <img src="${user?.avatar || 'https://via.placeholder.com/40'}" class="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" alt="Avatar">
             ${user && user.karma > 600 ? '<div class="absolute -inset-1 bg-gradient-to-tr from-[#0047FF] to-[#8000FF] rounded-full -z-10 blur-[2px] opacity-70"></div>' : ''}
          </div>
          <div class="ml-3">
            <div class="flex items-center gap-1">
              <p class="text-sm font-semibold text-slate-900 dark:text-white">${user?.name || 'Utilisateur inconnu'}</p>
              ${user && user.karma > 400 ? `<span class="text-blue-500 text-[10px]" title="Karma élevé: ${user.karma}">✦</span>` : ''}
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400">${formatDate(ad.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function createPulseTicker(): string {
  const eventsHtml = pulseEvents.map(event => `
    <div class="flex items-center space-x-2 px-6 py-2 border-r border-white/5 shrink-0">
      <span class="w-2 h-2 rounded-full ${event.type === 'sale' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : event.type === 'price_drop' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'} animate-pulse"></span>
      <span class="text-xs font-medium text-white/70 uppercase tracking-wider whitespace-nowrap">${event.message}</span>
    </div>
  `).join('');

  return `
    <div class="w-full bg-[#0a0a0a]/80 backdrop-blur-md border-y border-white/5 overflow-hidden h-10 flex items-center relative z-20">
      <div class="flex animate-ticker whitespace-nowrap">
        ${eventsHtml} ${eventsHtml} <!-- Duplicate for seamless loop -->
      </div>
    </div>
  `;
}

function getKarmaClass(karma: number): string {
  if (karma > 800) return 'border-[#8000FF]/50 ring-1 ring-[#8000FF]/20 shadow-[0_0_30px_rgba(128,0,255,0.15)]';
  if (karma > 400) return 'border-[#0047FF]/30 shadow-[0_0_20px_rgba(0,71,255,0.1)]';
  return '';
}

function getConditionBadgeClass(condition: string): string {
  switch (condition) {
    case 'Neuf': return 'badge-success';
    case 'Très bon état': return 'badge-primary';
    case 'Bon état': return 'badge-warning';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}
