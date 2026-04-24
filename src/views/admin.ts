import { getStats, getReportedAds, getPendingAds, deleteAd, updateAdStatus, users, categories, addCategory, removeCategory, updateUserStatus } from '../store.ts';
import { formatPrice, formatDate, showToast } from '../utils.ts';
import { Ad, User } from '../types.ts';
import Chart from 'chart.js/auto';

let analyticsChart: Chart | null = null;

export function renderAdminDashboard(): string {
  const stats = getStats();
  const reportedAds = getReportedAds();
  const pendingAds = getPendingAds();

  return `
    <div class="animate-fade-in max-w-7xl mx-auto">
      <div class="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 class="text-4xl font-display font-black text-slate-900 dark:text-white mb-2">Centre de Contrôle</h1>
          <p class="text-slate-500 dark:text-slate-400 text-lg">Gérez la marketplace d'une main de maître.</p>
        </div>
        <button id="btn-export-csv" class="btn bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/30 flex items-center space-x-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span>Exporter CSV</span>
        </button>
      </div>

      <!-- Stats Grid Premium -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        <div class="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-dark-border relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 relative z-10">Utilisateurs</p>
          <h3 class="text-4xl font-display font-bold text-slate-900 dark:text-white relative z-10">${stats.totalUsers}</h3>
        </div>
        <div class="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-3xl p-6 shadow-xl shadow-primary-500/30 text-white relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p class="text-sm font-semibold text-primary-100 mb-1 relative z-10">Annonces Actives</p>
          <h3 class="text-4xl font-display font-bold relative z-10">${stats.activeAds}</h3>
        </div>
        <div class="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-dark-border relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
          <p class="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1 relative z-10">Total Annonces</p>
          <h3 class="text-4xl font-display font-bold text-slate-900 dark:text-white relative z-10">${stats.totalAds}</h3>
        </div>
        <div class="bg-amber-50 dark:bg-amber-900/20 rounded-3xl p-6 shadow-xl shadow-amber-500/10 border border-amber-200/50 dark:border-amber-800/50 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <p class="text-sm font-semibold text-amber-600 dark:text-amber-500 mb-1 relative z-10">En Attente</p>
          <h3 class="text-4xl font-display font-bold text-amber-700 dark:text-amber-400 relative z-10">${stats.pendingAds}</h3>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6 shadow-xl shadow-red-500/10 border border-red-200/50 dark:border-red-800/50 relative overflow-hidden group hover:-translate-y-1 transition-transform">
          <p class="text-sm font-semibold text-red-600 dark:text-red-500 mb-1 relative z-10">Signalements</p>
          <h3 class="text-4xl font-display font-bold text-red-700 dark:text-red-400 relative z-10">${stats.reportedAds}</h3>
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="bg-white/90 dark:bg-[#111111]/90 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-slate-200/50 dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-slate-100 dark:border-dark-border overflow-hidden">
        
        <div class="flex border-b border-slate-200 dark:border-dark-border overflow-x-auto">
          <button id="tab-analytics" class="flex-1 py-5 px-6 text-sm font-bold border-b-2 text-primary-600 border-primary-600 bg-primary-50 dark:bg-primary-900/10 transition-colors whitespace-nowrap">
            Analytique
          </button>
          <button id="tab-pending" class="flex-1 py-5 px-6 text-sm font-bold border-b-2 text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap">
            Approbations (${pendingAds.length})
          </button>
          <button id="tab-moderation" class="flex-1 py-5 px-6 text-sm font-bold border-b-2 text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap">
            Signalements (${reportedAds.length})
          </button>
          <button id="tab-users" class="flex-1 py-5 px-6 text-sm font-bold border-b-2 text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap">
            Utilisateurs
          </button>
          <button id="tab-categories" class="flex-1 py-5 px-6 text-sm font-bold border-b-2 text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors whitespace-nowrap">
            Catégories
          </button>
        </div>

        <div class="p-8">
          <div id="analytics-view" class="animate-fade-in">
            <h2 class="text-xl font-bold mb-6 text-slate-900 dark:text-white">Évolution des Inscriptions et Annonces</h2>
            <div class="w-full h-80 relative">
              <canvas id="admin-chart"></canvas>
            </div>
          </div>
          <div id="pending-view" class="hidden animate-fade-in">
            ${renderPendingTable(pendingAds)}
          </div>
          <div id="moderation-view" class="hidden animate-fade-in">
            ${renderModerationTable(reportedAds)}
          </div>
          <div id="users-view" class="hidden animate-fade-in">
            ${renderUsersTable(users)}
          </div>
          <div id="categories-view" class="hidden animate-fade-in">
            ${renderCategoriesView()}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCategoriesView() {
  return `
    <div class="max-w-xl">
      <h2 class="text-xl font-bold mb-6 text-slate-900 dark:text-white">Gérer les catégories</h2>
      <div class="flex space-x-3 mb-8">
        <input type="text" id="new-category-input" placeholder="Nouvelle catégorie..." class="input-field flex-1">
        <button id="btn-add-category" class="btn btn-primary">Ajouter</button>
      </div>
      <div class="space-y-3" id="categories-list">
        ${categories.map(cat => `
          <div class="flex justify-between items-center bg-slate-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-slate-200 dark:border-dark-border">
            <span class="font-medium text-slate-700 dark:text-slate-300">${cat}</span>
            <button data-cat="${cat}" class="btn-delete-cat text-red-500 hover:text-red-700 font-medium transition-colors">Supprimer</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPendingTable(ads: Ad[]): string {
  if (ads.length === 0) {
    return `<div class="text-center py-16 text-slate-500 font-medium text-lg">Aucune annonce en attente de validation. Parfait ! 🎉</div>`;
  }
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      ${ads.map(ad => `
        <div class="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-slate-100 dark:border-dark-border p-5 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all group">
          <div class="flex space-x-4 mb-4">
            <img src="${ad.imageUrl}" class="w-20 h-20 rounded-xl object-cover" alt="">
            <div class="flex-1">
              <h4 class="font-display font-bold text-slate-900 dark:text-white line-clamp-1">${ad.title}</h4>
              <p class="text-primary-600 font-bold">${formatPrice(ad.price)}</p>
              <p class="text-xs text-slate-500 mt-1">Par User: ${ad.userId}</p>
            </div>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6">${ad.description}</p>
          <div class="flex space-x-3">
             <button data-approve="${ad.id}" class="btn-approve flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold py-2 rounded-xl transition-colors">Approuver</button>
             <button data-reject="${ad.id}" class="btn-reject flex-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 rounded-xl transition-colors">Refuser</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderModerationTable(ads: Ad[]): string {
  if (ads.length === 0) {
    return `<div class="text-center py-16 text-slate-500 font-medium text-lg">Aucune annonce signalée. La communauté se porte bien ! 🕊️</div>`;
  }
  return `
    <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-dark-border">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-dark-border">
        <thead>
          <tr class="bg-slate-50 dark:bg-[#161616]">
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Annonce</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-[#1a1a1a] divide-y divide-slate-200 dark:divide-dark-border" id="reported-ads-list">
          ${ads.map(ad => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center">
                  <img class="h-12 w-12 rounded-xl object-cover shadow-sm" src="${ad.imageUrl}" alt="">
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors" onclick="window.router.navigate('details', { id: '${ad.id}' })">${ad.title}</div>
                    <div class="text-sm text-slate-500">${formatPrice(ad.price)}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-sm text-slate-500">${formatDate(ad.createdAt)}</td>
              <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                <button data-ignore="${ad.id}" class="btn-ignore px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">Ignorer</button>
                <button data-delete="${ad.id}" class="btn-delete px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors">Supprimer</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderUsersTable(usersList: User[]): string {
  return `
    <div class="overflow-x-auto rounded-2xl border border-slate-200 dark:border-dark-border">
      <table class="min-w-full divide-y divide-slate-200 dark:divide-dark-border">
        <thead>
          <tr class="bg-slate-50 dark:bg-[#161616]">
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
            <th class="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-[#1a1a1a] divide-y divide-slate-200 dark:divide-dark-border">
          ${usersList.map(user => `
            <tr class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
              <td class="px-6 py-5 whitespace-nowrap">
                <div class="flex items-center">
                  <img class="h-10 w-10 rounded-full border-2 border-white shadow-sm" src="${user.avatar}" alt="">
                  <div class="ml-4">
                    <div class="text-sm font-bold text-slate-900 dark:text-white">${user.name}</div>
                    <div class="text-sm text-slate-500">${user.email}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                <span class="px-3 py-1 inline-flex text-xs font-bold rounded-full ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-100 text-slate-800'}">
                  ${user.role.toUpperCase()}
                </span>
              </td>
              <td class="px-6 py-5 whitespace-nowrap">
                ${user.status === 'banned' ? '<span class="text-red-500 font-bold">Banni</span>' :
      user.status === 'suspended' ? '<span class="text-amber-500 font-bold">Suspendu</span>' :
        '<span class="text-emerald-500 font-bold">Actif</span>'}
              </td>
              <td class="px-6 py-5 whitespace-nowrap text-right text-sm space-x-2">
                ${user.role !== 'admin' ? `
                  <button data-warn="${user.id}" class="btn-warn px-2 py-1 text-xs font-bold bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors">Avertir</button>
                  <button data-suspend="${user.id}" class="btn-suspend px-2 py-1 text-xs font-bold bg-orange-100 text-orange-800 rounded hover:bg-orange-200 transition-colors">Suspendre</button>
                  <button data-ban="${user.id}" class="btn-ban px-2 py-1 text-xs font-bold bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">Bannir</button>
                ` : '<span class="text-slate-400">N/A</span>'}
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

export function setupAdminLogic() {
  const tabAnalytics = document.getElementById('tab-analytics');
  const tabPending = document.getElementById('tab-pending');
  const tabMod = document.getElementById('tab-moderation');
  const tabUsers = document.getElementById('tab-users');
  const tabCat = document.getElementById('tab-categories');

  const viewAnalytics = document.getElementById('analytics-view');
  const viewPending = document.getElementById('pending-view');
  const viewMod = document.getElementById('moderation-view');
  const viewUsers = document.getElementById('users-view');
  const viewCat = document.getElementById('categories-view');

  function resetTabs() {
    [tabAnalytics, tabPending, tabMod, tabUsers, tabCat].forEach(t => {
      t?.classList.remove('text-primary-600', 'text-amber-600', 'border-primary-600', 'border-amber-500', 'bg-primary-50', 'bg-amber-50', 'dark:bg-primary-900/10', 'dark:bg-amber-900/10');
      t?.classList.add('text-slate-500', 'border-transparent');
    });
    [viewAnalytics, viewPending, viewMod, viewUsers, viewCat].forEach(v => v?.classList.add('hidden'));
  }

  tabAnalytics?.addEventListener('click', () => {
    resetTabs();
    tabAnalytics.classList.remove('text-slate-500', 'border-transparent');
    tabAnalytics.classList.add('text-primary-600', 'border-primary-600', 'bg-primary-50', 'dark:bg-primary-900/10');
    viewAnalytics?.classList.remove('hidden');
    initChart();
  });

  tabPending?.addEventListener('click', () => {
    resetTabs();
    tabPending.classList.remove('text-slate-500', 'border-transparent');
    tabPending.classList.add('text-amber-600', 'border-amber-500', 'bg-amber-50', 'dark:bg-amber-900/10');
    viewPending?.classList.remove('hidden');
  });

  tabMod?.addEventListener('click', () => {
    resetTabs();
    tabMod.classList.remove('text-slate-500', 'border-transparent');
    tabMod.classList.add('text-primary-600', 'border-primary-600', 'bg-primary-50', 'dark:bg-primary-900/10');
    viewMod?.classList.remove('hidden');
  });

  tabUsers?.addEventListener('click', () => {
    resetTabs();
    tabUsers.classList.remove('text-slate-500', 'border-transparent');
    tabUsers.classList.add('text-primary-600', 'border-primary-600', 'bg-primary-50', 'dark:bg-primary-900/10');
    viewUsers?.classList.remove('hidden');
  });

  tabCat?.addEventListener('click', () => {
    resetTabs();
    tabCat.classList.remove('text-slate-500', 'border-transparent');
    tabCat.classList.add('text-primary-600', 'border-primary-600', 'bg-primary-50', 'dark:bg-primary-900/10');
    viewCat?.classList.remove('hidden');
  });

  // Export CSV
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Nom,Email,Role,Status\\n" +
      users.map(e => `${e.id},${e.name},${e.email},${e.role},${e.status || 'active'}`).join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_market_users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Export CSV réussi', 'success');
  });

  // Categories actions
  function setupCategoryLogic() {
    const btnAdd = document.getElementById('btn-add-category');
    const input = document.getElementById('new-category-input') as HTMLInputElement;

    btnAdd?.addEventListener('click', () => {
      if (input && input.value) {
        addCategory(input.value);
        showToast('Catégorie ajoutée', 'success');
        reRenderViews();
        input.value = '';
      }
    });

    document.querySelectorAll('.btn-delete-cat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = (e.currentTarget as HTMLElement).getAttribute('data-cat');
        if (cat) {
          removeCategory(cat);
          showToast('Catégorie supprimée', 'info');
          reRenderViews();
        }
      });
    });
  }

  // Users actions
  function setupUserActions() {
    document.querySelectorAll('.btn-warn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-warn');
        if (id) {
          showToast("Email d'avertissement envoyé à l'utilisateur.", 'info');
        }
      });
    });
    document.querySelectorAll('.btn-suspend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-suspend');
        if (id) {
          updateUserStatus(id, 'suspended');
          showToast('Utilisateur suspendu. Email envoyé.', 'info');
          reRenderViews();
        }
      });
    });
    document.querySelectorAll('.btn-ban').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-ban');
        if (id) {
          const isConfirmed = await window.router.components.showConfirm('Bannir ?', "L'utilisateur sera définitivement banni.", 'danger');
          if (isConfirmed) {
            updateUserStatus(id, 'banned');
            showToast('Utilisateur banni. Email envoyé.', 'error');
            reRenderViews();
          }
        }
      });
    });
  }

  function setupApprovalButtons() {
    document.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-approve');
        if (id) {
          updateAdStatus(id, 'active');
          showToast('Annonce approuvée et publiée.', 'success');
          reRenderViews();
        }
      });
    });

    document.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-reject');
        if (id) {
          const isConfirmed = await window.router.components.showConfirm('Refuser ?', 'Cette annonce sera rejetée et supprimée.', 'warning');
          if (isConfirmed) {
            deleteAd(id);
            showToast('Annonce refusée.', 'info');
            reRenderViews();
          }
        }
      });
    });
  }

  function setupModerationButtons() {
    document.querySelectorAll('.btn-ignore').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-ignore');
        if (id) {
          updateAdStatus(id, 'active');
          showToast('Signalement ignoré.', 'success');
          reRenderViews();
        }
      });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-delete');
        if (id) {
          const isConfirmed = await window.router.components.showConfirm('Supprimer ?', 'Confirmer la suppression définitive de cette annonce ?', 'danger');
          if (isConfirmed) {
            deleteAd(id);
            showToast('Annonce supprimée définitivement.', 'success');
            reRenderViews();
          }
        }
      });
    });
  }

  function reRenderViews() {
    const freshPending = getPendingAds();
    const freshReported = getReportedAds();

    if (viewPending) viewPending.innerHTML = renderPendingTable(freshPending);
    if (viewMod) viewMod.innerHTML = renderModerationTable(freshReported);
    if (viewUsers) viewUsers.innerHTML = renderUsersTable(users);
    if (viewCat) viewCat.innerHTML = renderCategoriesView();

    if (tabPending) tabPending.textContent = `Approbations (${freshPending.length})`;
    if (tabMod) tabMod.textContent = `Signalements (${freshReported.length})`;

    setupApprovalButtons();
    setupModerationButtons();
    setupCategoryLogic();
    setupUserActions();
  }

  function initChart() {
    const ctx = document.getElementById('admin-chart') as HTMLCanvasElement;
    if (!ctx) return;

    if (analyticsChart) {
      analyticsChart.destroy();
    }

    analyticsChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
        datasets: [
          {
            label: 'Nouvelles Inscriptions',
            data: [12, 19, 15, 25],
            borderColor: '#0ea5e9',
            tension: 0.4,
            fill: false
          },
          {
            label: 'Nouvelles Annonces',
            data: [25, 32, 28, 45],
            borderColor: '#8b5cf6',
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
          }
        },
        scales: {
          x: { ticks: { color: document.documentElement.classList.contains('dark') ? '#aaa' : '#666' } },
          y: { ticks: { color: document.documentElement.classList.contains('dark') ? '#aaa' : '#666' } }
        }
      }
    });
  }

  setupApprovalButtons();
  setupModerationButtons();
  setupCategoryLogic();
  setupUserActions();
  initChart();
}
