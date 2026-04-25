import {
  getCurrentUser,
  getNotificationsFor,
  getUnreadCount,
  markAllRead,
  markNotificationRead,
  clearNotifications
} from '../store.ts';
import { AppNotification } from '../types.ts';

const ICONS: Record<AppNotification['type'], string> = {
  message: '💬',
  ad_approved: '✅',
  ad_reported: '🚩',
  price_drop: '📉',
  offer_received: '💰',
  offer_accepted: '🤝',
  system: '🛰️'
};

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return 'à l\'instant';
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.floor(h / 24);
  return `il y a ${d} j`;
}

export function refreshNotificationBadge() {
  const user = getCurrentUser();
  const badges = [
    document.getElementById('notif-count-badge'),
    document.getElementById('notif-count-badge-mobile')
  ];
  const count = user ? getUnreadCount(user.id) : 0;
  badges.forEach(b => {
    if (!b) return;
    if (count > 0) {
      b.classList.remove('hidden');
      b.textContent = count > 99 ? '99+' : String(count);
    } else {
      b.classList.add('hidden');
    }
  });
}

function renderItem(n: AppNotification): string {
  return `
    <button data-notif-id="${n.id}"
      class="notif-item w-full text-left p-3 rounded-2xl border ${n.read ? 'border-white/5 bg-white/[0.02]' : 'border-[#0047FF]/30 bg-[#0047FF]/[0.06]'} hover:border-white/20 transition-all flex gap-3 group">
      <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">${ICONS[n.type] || '🔔'}</div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <p class="text-sm font-bold text-white line-clamp-1">${n.title}</p>
          ${!n.read ? '<span class="w-2 h-2 mt-1.5 rounded-full bg-[#00FFFF] shadow-[0_0_8px_#00FFFF] shrink-0"></span>' : ''}
        </div>
        <p class="text-xs text-white/60 line-clamp-2 mt-0.5">${n.body}</p>
        <p class="text-[10px] text-white/30 uppercase tracking-widest mt-1.5">${formatRelative(n.timestamp)}</p>
      </div>
    </button>
  `;
}

function renderList(): void {
  const list = document.getElementById('notifications-list');
  if (!list) return;
  const user = getCurrentUser();
  if (!user) {
    list.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-16 text-white/40">
        <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-2xl">🔔</div>
        <p class="text-sm font-medium">Connectez-vous pour voir vos notifications.</p>
      </div>`;
    return;
  }
  const items = getNotificationsFor(user.id);
  if (items.length === 0) {
    list.innerHTML = `
      <div class="h-full flex flex-col items-center justify-center text-center py-16 text-white/40">
        <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-2xl">✨</div>
        <p class="text-sm font-medium">Tout est calme. Aucune notification pour le moment.</p>
      </div>`;
    return;
  }
  list.innerHTML = items.map(renderItem).join('');

  list.querySelectorAll<HTMLElement>('.notif-item').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.getAttribute('data-notif-id');
      if (!id) return;
      const note = items.find(n => n.id === id);
      markNotificationRead(id);
      refreshNotificationBadge();
      closeDrawer();
      if (note?.link) {
        window.router.navigate(note.link.view, note.link.params);
      }
    });
  });
}

function openDrawer() {
  const drawer = document.getElementById('notifications-drawer');
  if (!drawer) return;
  renderList();
  drawer.classList.remove('hidden');
  drawer.classList.add('flex');
}

function closeDrawer() {
  const drawer = document.getElementById('notifications-drawer');
  if (!drawer) return;
  drawer.classList.add('hidden');
  drawer.classList.remove('flex');
}

export function setupNotificationsDrawer() {
  document.getElementById('open-notifications-btn')?.addEventListener('click', openDrawer);
  document.getElementById('open-notifications-btn-mobile')?.addEventListener('click', openDrawer);
  document.getElementById('close-notifications-drawer')?.addEventListener('click', closeDrawer);
  document.getElementById('notifications-backdrop')?.addEventListener('click', closeDrawer);

  document.getElementById('notif-mark-all')?.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;
    markAllRead(user.id);
    refreshNotificationBadge();
    renderList();
  });

  document.getElementById('notif-clear')?.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;
    clearNotifications(user.id);
    refreshNotificationBadge();
    renderList();
  });

  // Refresh badge periodically (catches changes from other handlers)
  setInterval(refreshNotificationBadge, 4000);
}
