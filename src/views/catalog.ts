import { getAds, categories } from '../store.ts';
import { createAdCard, createPulseTicker } from '../components.ts';

export function renderCatalog(params?: { category?: string, search?: string }): string {
  // Le filtrage se fera via JS après le rendu pour être interactif sans rechargement
  const currentCat = params?.category || '';
  const currentSearch = params?.search || '';

  const catOptions = categories.map(c =>
    `<button class="filter-btn px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 whitespace-nowrap transition-colors ${currentCat === c ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-600 dark:text-gray-400'}" data-category="${c}">
      ${c}
    </button>`
  ).join('');

  return `
    ${createPulseTicker()}
    <div class="animate-fade-in flex flex-col md:flex-row gap-8 mt-6">
      <!-- Sidebar Filters -->
      <aside class="w-full md:w-64 flex-shrink-0">
        <div class="bg-white dark:bg-dark-card rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Filtres</h2>
          
          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Recherche</h3>
            <input type="text" id="catalog-search" value="${currentSearch}" class="input-field" placeholder="Ex: MacBook, Livre...">
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Trier par</h3>
            <select id="catalog-sort" class="input-field">
              <option value="recent">Plus récentes</option>
              <option value="popular">Plus populaires</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <div class="mb-6">
            <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Catégories</h3>
            <div class="flex flex-wrap gap-2 md:flex-col" id="category-filters">
              <button class="filter-btn px-4 py-2 rounded-full md:rounded-lg border md:border-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors ${!currentCat ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 md:border-primary-50' : 'text-gray-600 dark:text-gray-400'}" data-category="">
                Toutes les catégories
              </button>
              ${categories.map(c => `
                <button class="filter-btn px-4 py-2 rounded-full md:rounded-lg border md:border-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-left transition-colors ${currentCat === c ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 md:border-primary-50' : 'text-gray-600 dark:text-gray-400'}" data-category="${c}">
                  ${c}
                </button>
              `).join('')}
            </div>
          </div>
          
          <div>
             <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-3">Prix maximum : <span id="price-display">500</span>€</h3>
             <input type="range" id="price-range" min="0" max="1500" value="500" class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-primary-600">
             <div class="flex justify-between text-xs text-gray-500 mt-2">
               <span>0€</span>
               <span>1500€+</span>
             </div>
          </div>
        </div>
      </aside>

      <!-- Main Results -->
      <div class="flex-grow">
        <div class="mb-6 flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Catalogue</h1>
          <span class="text-gray-500 dark:text-gray-400 text-sm" id="results-count">-- annonces</span>
        </div>
        
        <div id="catalog-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <!-- Injecté via JS -->
        </div>
        
        <div id="empty-state" class="hidden py-16 flex flex-col items-center text-center text-gray-500 dark:text-gray-400">
          <svg class="w-16 h-16 mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <p class="text-lg font-medium">Aucune annonce ne correspond à vos critères.</p>
          <button id="reset-filters" class="mt-4 text-primary-600 dark:text-primary-400 font-medium hover:underline">Réinitialiser les filtres</button>
        </div>
      </div>
    </div>
  `;
}

// Logique attachée après le rendu
export function setupCatalogLogic(params?: { category?: string, search?: string }) {
  const searchInput = document.getElementById('catalog-search') as HTMLInputElement;
  const filterBtns = document.querySelectorAll('.filter-btn');
  const priceRange = document.getElementById('price-range') as HTMLInputElement;
  const priceDisplay = document.getElementById('price-display');
  const grid = document.getElementById('catalog-grid');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');
  const resetBtn = document.getElementById('reset-filters');

  let activeCategory = params?.category || '';
  let maxPrice = parseInt(priceRange.value);

  const applyFilters = () => {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredAds = getAds().filter(ad => {
      const matchSearch = ad.title.toLowerCase().includes(searchTerm) || ad.description.toLowerCase().includes(searchTerm);
      const matchCategory = activeCategory === '' || ad.category === activeCategory;
      const matchPrice = ad.price <= maxPrice;
      return matchSearch && matchCategory && matchPrice;
    });

    const sortSelect = document.getElementById('catalog-sort') as HTMLSelectElement;
    const sortValue = sortSelect ? sortSelect.value : 'recent';

    filteredAds.sort((a, b) => {
      if (sortValue === 'popular') return b.views - a.views;
      if (sortValue === 'price-asc') return a.price - b.price;
      if (sortValue === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    if (resultsCount) resultsCount.textContent = `${filteredAds.length} annonce${filteredAds.length > 1 ? 's' : ''}`;

    if (filteredAds.length === 0) {
      grid?.classList.add('hidden');
      emptyState?.classList.remove('hidden');
      emptyState?.classList.add('flex');
    } else {
      emptyState?.classList.add('hidden');
      emptyState?.classList.remove('flex');
      grid?.classList.remove('hidden');
      if (grid) grid.innerHTML = filteredAds.map(createAdCard).join('');
    }
  };

  searchInput?.addEventListener('input', applyFilters);

  const sortSelect = document.getElementById('catalog-sort');
  sortSelect?.addEventListener('change', applyFilters);

  priceRange?.addEventListener('input', (e) => {
    maxPrice = parseInt((e.target as HTMLInputElement).value);
    if (priceDisplay) priceDisplay.textContent = maxPrice.toString();
    applyFilters();
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      activeCategory = target.getAttribute('data-category') || '';

      // Update UI
      filterBtns.forEach(b => {
        if (b.classList.contains('md:border-transparent')) { // Desktop vertical style
          b.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600');
          b.classList.add('text-gray-600', 'dark:text-gray-400');
        }
      });
      target.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600');
      target.classList.remove('text-gray-600', 'dark:text-gray-400');

      applyFilters();
    });
  });

  resetBtn?.addEventListener('click', () => {
    searchInput.value = '';
    activeCategory = '';
    priceRange.value = '1500';
    if (priceDisplay) priceDisplay.textContent = '1500';
    // Reset buttons UI visually...
    filterBtns.forEach(b => {
      b.classList.remove('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600');
      if (b.getAttribute('data-category') === '') {
        b.classList.add('bg-primary-50', 'dark:bg-primary-900/20', 'text-primary-600');
      }
    });
    applyFilters();
  });

  // Init fetch
  applyFilters();
}
