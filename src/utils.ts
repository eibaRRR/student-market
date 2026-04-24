export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');

  let bgClass = 'bg-slate-800';
  let icon = `<svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

  if (type === 'success') {
    bgClass = 'bg-slate-800';
    icon = `<svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }
  if (type === 'error') {
    bgClass = 'bg-red-900 border border-red-800';
    icon = `<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
  }

  toast.className = `${bgClass} text-white px-5 py-3.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 transform transition-all duration-300 translate-y-10 opacity-0 flex items-center justify-between min-w-[320px] max-w-md`;

  toast.innerHTML = `
    <div class="flex items-center space-x-3">
      ${icon}
      <span class="font-medium text-sm">${message}</span>
    </div>
    <button class="ml-4 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-full p-1">
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  const closeBtn = toast.querySelector('button');

  const removeToast = () => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  };

  closeBtn?.addEventListener('click', removeToast);
  setTimeout(removeToast, 4000);
}

export function showConfirm(title: string, message: string, type: 'danger' | 'warning' = 'danger'): Promise<boolean> {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md opacity-0 transition-opacity duration-300';

    const iconColor = type === 'danger' ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400';
    const bgColor = type === 'danger' ? 'bg-red-100 dark:bg-red-500/20' : 'bg-amber-100 dark:bg-amber-500/20';
    const btnColor = type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-500/30' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/30';

    modal.innerHTML = `
      <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full transform scale-95 transition-transform duration-300 border border-slate-200 dark:border-slate-800 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-2 ${type === 'danger' ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-amber-400 to-orange-500'}"></div>
        <div class="w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto transform -rotate-3 border border-white/50 dark:border-slate-800 shadow-inner">
          <svg class="w-8 h-8 ${iconColor}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h3 class="text-2xl font-display font-bold text-center text-slate-900 dark:text-white mb-3">${title}</h3>
        <p class="text-center text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">${message}</p>
        
        <div class="flex space-x-3">
          <button id="cancel-btn" class="flex-1 px-4 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold transition-colors">Annuler</button>
          <button id="confirm-btn" class="flex-1 px-4 py-3.5 ${btnColor} text-white rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5">Confirmer</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0');
      modal.querySelector('div')?.classList.remove('scale-95');
    });

    const close = (result: boolean) => {
      modal.classList.add('opacity-0');
      modal.querySelector('div')?.classList.add('scale-95');
      setTimeout(() => modal.remove(), 300);
      resolve(result);
    };

    modal.querySelector('#cancel-btn')?.addEventListener('click', () => close(false));
    modal.querySelector('#confirm-btn')?.addEventListener('click', () => close(true));
  });
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date inconnue';
    }
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return 'Date inconnue';
  }
}
