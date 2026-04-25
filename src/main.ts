import './style.css';
import { renderHome } from './views/home.ts';
import { renderCatalog, setupCatalogLogic } from './views/catalog.ts';
import { renderDetails } from './views/details.ts';
import { renderStudentDashboard, setupStudentLogic } from './views/student.ts';
import { renderAdminDashboard, setupAdminLogic } from './views/admin.ts';
import { renderAuth, setupAuthLogic } from './views/auth.ts';
import { renderChat, setupChatLogic } from './views/chat.ts';
import { renderUserProfile, setupUserProfileLogic } from './views/user.ts';
import { setupChatbot } from './components/chatbot.ts';
import { setupNotificationsDrawer, refreshNotificationBadge } from './components/notifications.ts';
import { showToast, showConfirm } from './utils.ts';
import { getCurrentUser, logout, toggleFavorite } from './store.ts';

// Type d'extension pour window
declare global {
  interface Window {
    router: {
      navigate: (path: string, params?: any) => void;
      updateNavbar: () => void;
      currentView: string;
      params: any;
      components: {
        showToast: typeof showToast;
        showConfirm: typeof showConfirm;
        logoutUser?: () => void;
      };
    };
    handleFavoriteClick: (e: Event, adId: string, btn: HTMLElement) => void;
  }
}

// Router simplifié
const Router = {
  currentView: 'home',
  params: null as any,
  components: {} as any,

  navigate(path: string, params?: any) {
    // Protection des routes
    const user = getCurrentUser();
    if ((path === 'student' || path === 'admin') && !user) {
      showToast('Veuillez vous connecter pour accéder à cette page.', 'info');
      this.currentView = 'auth';
      this.params = null;
    }
    else if (path === 'admin' && user?.role !== 'admin') {
      showToast('Accès refusé. Réservé aux administrateurs.', 'error');
      return; // Ne change pas de vue
    }
    else {
      this.currentView = path;
      this.params = params || null;
    }

    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const container = document.getElementById('app-container');
    if (!container) return;

    container.className = 'w-full h-full relative p-4 lg:p-12';

    switch (this.currentView) {
      case 'home':
        container.innerHTML = renderHome();
        break;
      case 'catalog':
        container.classList.add('w-full');
        container.innerHTML = renderCatalog(this.params);
        setupCatalogLogic(this.params);
        break;
      case 'details':
        container.innerHTML = renderDetails(this.params);
        import('./views/details.ts').then(m => {
          if (m.setupDetailsLogic) m.setupDetailsLogic(this.params.id);
        });
        break;
      case 'student':
        container.innerHTML = renderStudentDashboard();
        setupStudentLogic(this.params);
        break;
      case 'admin':
        container.innerHTML = renderAdminDashboard();
        setupAdminLogic();
        break;
      case 'auth':
        container.innerHTML = renderAuth();
        setupAuthLogic();
        break;
      case 'chat':
        container.innerHTML = renderChat(this.params);
        setupChatLogic(this.params);
        break;
      case 'user':
        container.innerHTML = renderUserProfile(this.params);
        setupUserProfileLogic(this.params);
        break;
      default:
        container.innerHTML = '<h2>Vue introuvable</h2>';
    }
  },

  updateNavbar() {
    const user = getCurrentUser();
    const container = document.getElementById('auth-sidebar-container');
    const fab = document.getElementById('fab-container');

    if (user && fab) {
      fab.classList.remove('hidden');
      fab.classList.add('md:flex');
    }
    else if (fab) {
      fab.classList.add('hidden');
      fab.classList.remove('md:flex');
    }

    refreshNotificationBadge();

    if (!container) return;

    if (user) {
      container.innerHTML = `
        <button onclick="window.router.navigate('student')" aria-label="Mon profil" class="w-full h-12 flex items-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all overflow-hidden shrink-0">
          <div class="w-12 h-12 flex items-center justify-center shrink-0">
             <img src="${user.avatar}" class="w-8 h-8 rounded-full border border-white/20 shrink-0" alt="Avatar de ${user.name}">
          </div>
          <span class="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity">Profil</span>
        </button>
        ${user.role === 'admin' ? `
        <button onclick="window.router.navigate('admin')" aria-label="Tableau d'administration" class="w-full h-12 flex items-center rounded-2xl bg-[#8000FF]/20 hover:bg-[#8000FF]/40 text-[#8000FF] transition-all overflow-hidden shrink-0">
          <div class="w-12 h-12 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span class="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity">Admin</span>
        </button>` : ''}
        <button onclick="window.router.components.logoutUser()" aria-label="Se déconnecter" class="w-full h-12 flex items-center rounded-2xl hover:bg-red-500/20 text-slate-400 hover:text-red-500 transition-all overflow-hidden shrink-0">
          <div class="w-12 h-12 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <span class="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity">Déconnexion</span>
        </button>
      `;
    } else {
      container.innerHTML = `
        <button onclick="window.router.navigate('auth')" aria-label="Se connecter" class="w-full h-12 flex items-center rounded-2xl hover:bg-white/10 text-white transition-all overflow-hidden shrink-0 border border-white/20">
          <div class="w-12 h-12 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
          </div>
          <span class="ml-2 font-bold whitespace-nowrap opacity-0 transition-opacity">Connexion</span>
        </button>
      `;
    }
  }
};

window.router = Router as any;
window.router.components = {
  showToast,
  showConfirm,
  logoutUser: () => {
    logout();
    showToast('Vous êtes déconnecté.', 'info');
    Router.updateNavbar();
    Router.navigate('home');
  }
};

// Force dark mode
function setupTheme() {
  document.documentElement.classList.add('dark');
}

function openSearchOverlay() {
  const overlay = document.getElementById('search-overlay');
  overlay?.classList.remove('hidden');
  setTimeout(() => {
    (document.getElementById('overlay-search-input') as HTMLInputElement | null)?.focus();
  }, 30);
}

function closeSearchOverlay() {
  document.getElementById('search-overlay')?.classList.add('hidden');
}

// Global Nav Listeners
function setupNav() {
  const overlaySearch = document.getElementById('overlay-search-input') as HTMLInputElement | null;
  overlaySearch?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      closeSearchOverlay();
      Router.navigate('catalog', { search: overlaySearch.value });
      overlaySearch.value = '';
    }
  });

  // Suggestion chips
  document.querySelectorAll<HTMLElement>('#search-suggestions [data-q]').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q') || '';
      closeSearchOverlay();
      Router.navigate('catalog', { search: q });
    });
  });

  document.getElementById('open-search-btn')?.addEventListener('click', openSearchOverlay);
  document.getElementById('open-search-btn-mobile')?.addEventListener('click', openSearchOverlay);
  document.getElementById('fab-search-btn')?.addEventListener('click', openSearchOverlay);
  document.getElementById('close-search-overlay')?.addEventListener('click', closeSearchOverlay);

  // Mobile chatbot toggle delegates to the desktop one
  document.getElementById('chatbot-sidebar-toggle-mobile')?.addEventListener('click', () => {
    document.getElementById('chatbot-sidebar-toggle')?.dispatchEvent(new Event('click'));
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
    const inField = tag === 'input' || tag === 'textarea' || tag === 'select';
    const overlayOpen = !document.getElementById('search-overlay')?.classList.contains('hidden');

    if (e.key === 'Escape') {
      if (overlayOpen) closeSearchOverlay();
      const drawer = document.getElementById('notifications-drawer');
      if (drawer && !drawer.classList.contains('hidden')) drawer.classList.add('hidden');
      return;
    }

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchOverlay();
      return;
    }
    if (e.key === '/' && !inField && !overlayOpen) {
      e.preventDefault();
      openSearchOverlay();
    }
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupNav();
  setupChatbot();
  setupNotificationsDrawer();
  Router.updateNavbar();
  Router.render();
});

window.handleFavoriteClick = (e: Event, adId: string, btn: HTMLElement) => {
  e.stopPropagation();
  const user = getCurrentUser();
  if (!user) {
    showToast('Connectez-vous pour ajouter aux favoris.', 'info');
    return;
  }
  if (adId) {
    toggleFavorite(user.id, adId);
    showToast('Favoris mis à jour !', 'success');

    const svg = btn.querySelector('svg');
    if (svg) {
      const isFav = svg.getAttribute('fill') === 'currentColor';
      svg.setAttribute('fill', isFav ? 'none' : 'currentColor');
      svg.classList.toggle('text-red-500');
      svg.classList.toggle('text-gray-400');
    }

    if (Router.currentView === 'student') {
      Router.navigate('student');
    }
  }
};
