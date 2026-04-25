import { getUserById, getUserAds, getUserAverageRating } from '../store.ts';
import { createAdCard } from '../components.ts';

export function renderUserProfile(params: { id: string }): string {
  const user = getUserById(params.id);
  if (!user) {
    return `<div class="text-center py-20 text-white/60 font-medium">Profil introuvable.</div>`;
  }

  const { avg, count } = getUserAverageRating(user.id);
  const myAds = getUserAds(user.id).filter(a => a.status === 'active' || a.status === 'reserved');
  const sold = getUserAds(user.id).filter(a => a.status === 'sold').length;
  const karma = user.karma || 0;
  const karmaPct = Math.min((karma / 1000) * 100, 100);
  const ratingDist = [5, 4, 3, 2, 1].map(score => {
    const c = (user.ratings || []).filter(r => r.score === score).length;
    const pct = count > 0 ? Math.round((c / count) * 100) : 0;
    return { score, c, pct };
  });

  return `
    <div class="animate-fade-in max-w-6xl mx-auto">
      <button onclick="window.history.back()" aria-label="Retour"
        class="mb-6 text-white/60 hover:text-white flex items-center gap-2 text-sm transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Retour
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile card -->
        <aside class="glass-panel rounded-3xl p-8 text-center">
          <div class="relative w-28 h-28 mx-auto mb-4">
            <img src="${user.avatar}" class="w-full h-full rounded-3xl object-cover border-2 border-white/10" alt="Avatar de ${user.name}">
            ${karma > 500 ? '<div class="absolute -inset-2 bg-gradient-to-tr from-[#0047FF] to-[#8000FF] rounded-[2rem] -z-10 blur-md opacity-50"></div>' : ''}
          </div>
          <h1 class="text-2xl font-display font-bold text-white">${user.name}</h1>
          <p class="text-[10px] text-white/40 uppercase tracking-widest mt-1">${user.role === 'admin' ? 'Administrateur' : 'Étudiant·e'}</p>

          <div class="grid grid-cols-3 gap-3 mt-6 border-t border-white/5 pt-6 text-left">
            <div>
              <p class="text-[10px] text-white/40 uppercase tracking-widest">Actives</p>
              <p class="text-xl font-display font-bold text-white">${myAds.length}</p>
            </div>
            <div>
              <p class="text-[10px] text-white/40 uppercase tracking-widest">Vendus</p>
              <p class="text-xl font-display font-bold text-emerald-400">${sold}</p>
            </div>
            <div>
              <p class="text-[10px] text-white/40 uppercase tracking-widest">Karma</p>
              <p class="text-xl font-display font-bold text-[#00FFFF]">${karma}</p>
            </div>
          </div>

          <div class="mt-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] text-white/40 uppercase tracking-widest">Digital Karma</span>
              <span class="text-[10px] text-white/40">${Math.round(karmaPct)}%</span>
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div class="h-full rounded-full bg-gradient-to-r from-[#0047FF] to-[#8000FF]" style="width:${karmaPct}%"></div>
            </div>
          </div>

          ${(user.badges && user.badges.length > 0) ? `
          <div class="mt-6">
            <p class="text-[10px] text-white/40 uppercase tracking-widest mb-3">Badges</p>
            <div class="flex flex-wrap justify-center gap-2">
              ${user.badges.map(b => `
                <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl" title="${b.name} (${b.rarity})">${b.icon}</div>
              `).join('')}
            </div>
          </div>` : ''}
        </aside>

        <!-- Right column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Ratings -->
          <section class="glass-panel rounded-3xl p-6 sm:p-8">
            <div class="flex items-end gap-6 mb-6 flex-wrap">
              <div>
                <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Note moyenne</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-5xl font-display font-black text-white">${count > 0 ? avg.toFixed(1) : '—'}</span>
                  <span class="text-amber-400 text-xl">★</span>
                </div>
                <p class="text-xs text-white/40 mt-1">${count} avis</p>
              </div>
              <div class="flex-1 min-w-[200px] space-y-1.5">
                ${ratingDist.map(r => `
                  <div class="flex items-center gap-2 text-xs">
                    <span class="w-6 text-white/40 text-right">${r.score}★</span>
                    <div class="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div class="h-full bg-gradient-to-r from-amber-400 to-amber-300" style="width:${r.pct}%"></div>
                    </div>
                    <span class="w-8 text-white/40">${r.c}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </section>

          <!-- Listings -->
          <section>
            <h2 class="text-xl font-display font-bold text-white mb-4">Annonces de ${user.name} <span class="text-white/40 text-sm font-normal">(${myAds.length})</span></h2>
            ${myAds.length === 0 ? `
              <div class="glass-panel rounded-2xl p-10 text-center text-white/50">
                <p>${user.name} n'a aucune annonce active pour le moment.</p>
              </div>
            ` : `
              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                ${myAds.map(createAdCard).join('')}
              </div>
            `}
          </section>
        </div>
      </div>
    </div>
  `;
}

export function setupUserProfileLogic(_params: { id: string }) {
  // Cards already wire themselves via window.router on click — nothing to attach here for now.
}
