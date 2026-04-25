import { getAds, categories } from '../store.ts';
import { createAdCard, createPulseTicker } from '../components.ts';

const CATEGORY_ICONS: Record<string, string> = {
  'Livres': '📚',
  'Électronique': '💻',
  'Vêtements': '👕',
  'Logement': '🏠',
  'Services': '🛠️',
  'Autre': '✨'
};

function chipFor(cat: string, active: boolean): string {
  const icon = CATEGORY_ICONS[cat] || '🏷️';
  return `
    <button class="filter-btn shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${active
      ? 'bg-gradient-to-r from-[#0047FF] to-[#8000FF] text-white border-transparent shadow-[0_0_20px_rgba(0,71,255,0.4)]'
      : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20'}" data-category="${cat}">
      <span>${icon}</span>${cat}
    </button>`;
}

export function renderCatalog(params?: { category?: string, search?: string }): string {
  const currentCat = params?.category || '';
  const currentSearch = params?.search || '';
  const allAds = getAds();
  const maxPriceFromAds = Math.max(0, ...allAds.map(a => a.price));
  const sliderMax = Math.max(100, Math.ceil(maxPriceFromAds * 1.1));

  return `
    ${createPulseTicker()}
    <div class="animate-fade-in flex flex-col lg:flex-row gap-6 mt-6 max-w-7xl mx-auto">
      <!-- Sidebar Filters -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div class="glass-panel rounded-3xl p-6 lg:sticky lg:top-6">
          <div class="flex items-center justify-between mb-5">
            <h2 class="text-base font-display font-bold text-white">Filtres</h2>
            <button id="reset-filters" type="button" class="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors">Réinitialiser</button>
          </div>

          <div class="mb-6">
            <label for="catalog-search" class="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Recherche</label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input id="catalog-search" type="text" value="${currentSearch.replace(/"/g, '&quot;')}"
                class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition-colors"
                placeholder="MacBook, Livre, Tutorat…">
            </div>
          </div>

          <div class="mb-6">
            <label for="catalog-sort" class="block text-[10px] text-white/40 uppercase tracking-widest mb-2">Trier par</label>
            <select id="catalog-sort"
              class="w-full bg-black/30 border border-white/10 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF]">
              <option value="recent">Plus récentes</option>
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="watching">Plus convoitées</option>
            </select>
          </div>

          <div class="mb-6">
            <p class="text-[10px] text-white/40 uppercase tracking-widest mb-3">Catégories</p>
            <div class="flex flex-wrap gap-2" id="category-filters">
              <button class="filter-btn shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${!currentCat
                ? 'bg-gradient-to-r from-[#0047FF] to-[#8000FF] text-white border-transparent shadow-[0_0_20px_rgba(0,71,255,0.4)]'
                : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'}" data-category="">
                Toutes
              </button>
              ${categories.map(c => chipFor(c, currentCat === c)).join('')}
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[10px] text-white/40 uppercase tracking-widest mb-2">
              <span>Prix min : <span id="price-min-display" class="text-white">0</span>€</span>
              <span>Max : <span id="price-max-display" class="text-white">${sliderMax}</span>€</span>
            </div>
            <div class="relative h-8">
              <div class="absolute inset-y-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-white/5 rounded-full"></div>
              <div id="price-range-fill" class="absolute inset-y-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-[#0047FF] to-[#8000FF] rounded-full"></div>
              <input id="price-range-min" type="range" min="0" max="${sliderMax}" value="0" step="1"
                class="dual-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
                aria-label="Prix minimum">
              <input id="price-range-max" type="range" min="0" max="${sliderMax}" value="${sliderMax}" step="1"
                class="dual-range absolute inset-0 w-full appearance-none bg-transparent pointer-events-none"
                aria-label="Prix maximum">
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Results -->
      <div class="flex-grow min-w-0">
        <div class="mb-6 flex flex-wrap justify-between items-end gap-3">
          <div>
            <h1 class="text-3xl font-display font-black text-white">Catalogue</h1>
            <p class="text-white/40 text-sm">Explorez les annonces du campus.</p>
          </div>
          <span id="results-count" class="text-[#00FFFF] font-mono text-xs px-3 py-1.5 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/20">— annonces</span>
        </div>

        <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          ${Array.from({ length: 6 }).map(() => `
            <div class="skeleton-card glass-panel rounded-2xl overflow-hidden animate-pulse">
              <div class="h-44 bg-white/5"></div>
              <div class="p-4 space-y-3">
                <div class="h-3 w-1/3 rounded bg-white/10"></div>
                <div class="h-4 w-3/4 rounded bg-white/10"></div>
                <div class="h-3 w-full rounded bg-white/5"></div>
                <div class="h-3 w-2/3 rounded bg-white/5"></div>
              </div>
            </div>
          `).join('')}
        </div>

        <div id="empty-state" class="hidden py-16 flex-col items-center text-center text-white/50">
          <svg class="w-16 h-16 mb-4 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <p class="text-lg font-medium">Aucune annonce ne correspond à vos critères.</p>
          <button id="reset-filters-empty" type="button" class="mt-4 text-[#00FFFF] font-medium hover:underline">Réinitialiser les filtres</button>
        </div>
      </div>
    </div>
  `;
}

// Logique attachée après le rendu
export function setupCatalogLogic(params?: { category?: string, search?: string }) {
  const searchInput = document.getElementById('catalog-search') as HTMLInputElement;
  const filterBtns = () => document.querySelectorAll<HTMLElement>('.filter-btn');
  const minRange = document.getElementById('price-range-min') as HTMLInputElement;
  const maxRange = document.getElementById('price-range-max') as HTMLInputElement;
  const minDisp = document.getElementById('price-min-display');
  const maxDisp = document.getElementById('price-max-display');
  const fill = document.getElementById('price-range-fill');
  const grid = document.getElementById('catalog-grid');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');
  const resetBtn = document.getElementById('reset-filters');
  const resetBtnEmpty = document.getElementById('reset-filters-empty');

  let activeCategory = params?.category || '';
  const sliderMax = parseInt(maxRange?.max || '1500');

  // Make the range thumbs clickable while keeping the track non-interactive
  [minRange, maxRange].forEach(r => {
    if (!r) return;
    r.style.pointerEvents = 'auto';
  });

  function updateFill() {
    if (!fill || !minRange || !maxRange) return;
    const min = parseInt(minRange.value);
    const max = parseInt(maxRange.value);
    const left = (min / sliderMax) * 100;
    const right = 100 - (max / sliderMax) * 100;
    fill.style.left = left + '%';
    fill.style.right = right + '%';
    if (minDisp) minDisp.textContent = String(min);
    if (maxDisp) maxDisp.textContent = String(max);
  }

  function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let priceMin = parseInt(minRange.value);
    let priceMax = parseInt(maxRange.value);
    if (priceMin > priceMax) [priceMin, priceMax] = [priceMax, priceMin];

    const filtered = getAds().filter(ad => {
      const matchSearch = !searchTerm
        || ad.title.toLowerCase().includes(searchTerm)
        || ad.description.toLowerCase().includes(searchTerm)
        || ad.category.toLowerCase().includes(searchTerm);
      const matchCategory = activeCategory === '' || ad.category === activeCategory;
      const matchPrice = ad.price >= priceMin && ad.price <= priceMax;
      return matchSearch && matchCategory && matchPrice;
    });

    const sortSelect = document.getElementById('catalog-sort') as HTMLSelectElement | null;
    const sortValue = sortSelect ? sortSelect.value : 'recent';

    filtered.sort((a, b) => {
      if (sortValue === 'popular') return b.views - a.views;
      if (sortValue === 'price-asc') return a.price - b.price;
      if (sortValue === 'price-desc') return b.price - a.price;
      if (sortValue === 'watching') return (b.watchingCount || 0) - (a.watchingCount || 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (resultsCount) resultsCount.textContent = `${filtered.length} annonce${filtered.length > 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      grid?.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      emptyState?.classList.add('flex');
    } else {
      emptyState?.classList.add('hidden');
      emptyState?.classList.remove('flex');
      grid?.classList.remove('hidden');
      if (grid) grid.innerHTML = filtered.map(createAdCard).join('');
    }
  }

  searchInput?.addEventListener('input', applyFilters);
  document.getElementById('catalog-sort')?.addEventListener('change', applyFilters);

  minRange?.addEventListener('input', () => {
    if (parseInt(minRange.value) > parseInt(maxRange.value) - 1) {
      minRange.value = String(parseInt(maxRange.value) - 1);
    }
    updateFill();
    applyFilters();
  });
  maxRange?.addEventListener('input', () => {
    if (parseInt(maxRange.value) < parseInt(minRange.value) + 1) {
      maxRange.value = String(parseInt(minRange.value) + 1);
    }
    updateFill();
    applyFilters();
  });

  function bindFilterBtns() {
    filterBtns().forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.getAttribute('data-category') || '';
        filterBtns().forEach(b => {
          const isActive = (b.getAttribute('data-category') || '') === activeCategory;
          b.classList.toggle('bg-gradient-to-r', isActive);
          b.classList.toggle('from-[#0047FF]', isActive);
          b.classList.toggle('to-[#8000FF]', isActive);
          b.classList.toggle('text-white', isActive);
          b.classList.toggle('border-transparent', isActive);
          b.classList.toggle('shadow-[0_0_20px_rgba(0,71,255,0.4)]', isActive);
          b.classList.toggle('bg-white/5', !isActive);
          b.classList.toggle('border-white/10', !isActive);
          b.classList.toggle('text-white/60', !isActive);
        });
        applyFilters();
      });
    });
  }

  function resetAll() {
    searchInput.value = '';
    activeCategory = '';
    minRange.value = '0';
    maxRange.value = String(sliderMax);
    updateFill();
    filterBtns().forEach(b => {
      const isAll = (b.getAttribute('data-category') || '') === '';
      b.classList.toggle('bg-gradient-to-r', isAll);
      b.classList.toggle('from-[#0047FF]', isAll);
      b.classList.toggle('to-[#8000FF]', isAll);
      b.classList.toggle('text-white', isAll);
      b.classList.toggle('border-transparent', isAll);
      b.classList.toggle('shadow-[0_0_20px_rgba(0,71,255,0.4)]', isAll);
      b.classList.toggle('bg-white/5', !isAll);
      b.classList.toggle('border-white/10', !isAll);
      b.classList.toggle('text-white/60', !isAll);
    });
    applyFilters();
  }

  resetBtn?.addEventListener('click', resetAll);
  resetBtnEmpty?.addEventListener('click', resetAll);

  bindFilterBtns();
  updateFill();
  // Render after a short delay so the skeleton is briefly visible
  setTimeout(applyFilters, 60);
}
