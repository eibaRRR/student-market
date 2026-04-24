import { getAdById, getUserById } from '../store.ts';
import { formatPrice, formatDate, showToast } from '../utils.ts';

export function renderDetails(params: { id: string }): string {
  const ad = getAdById(params.id);
  
  if (!ad) {
    return `<div class="text-center py-20 text-xl font-medium text-gray-500">Annonce non trouvée.</div>`;
  }

  const user = getUserById(ad.userId);
  const ratings = user?.ratings || [];
  const ratingAvg = ratings.length > 0 ? (ratings.reduce((acc, r) => acc + r.score, 0) / ratings.length).toFixed(1) : 'N/A';
  const ratingCount = ratings.length;
  
  return `
    <div class="animate-fade-in max-w-5xl mx-auto">
      <button onclick="window.router.navigate('catalog')" class="mb-6 text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center transition-colors">
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Retour
      </button>

      <div class="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col md:flex-row">
        
        <!-- Image Section -->
        <div class="md:w-1/2 relative bg-gray-100 dark:bg-[#0a0a0a] flex items-center justify-center p-4 min-h-[300px] md:min-h-[500px]">
          <img src="${ad.imageUrl}" alt="${ad.title}" class="max-w-full max-h-full object-contain rounded-lg shadow-lg">
        </div>

        <!-- Content Section -->
        <div class="md:w-1/2 p-8 flex flex-col">
          <div class="flex justify-between items-start mb-4">
            <span class="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">${ad.category}</span>
            <span class="badge ${ad.condition === 'Neuf' ? 'badge-success' : 'badge-primary'}">${ad.condition}</span>
          </div>
          
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">${ad.title}</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm mb-6">Publié le ${formatDate(ad.createdAt)} • ${ad.views} vues</p>
          
          <div class="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
            ${formatPrice(ad.price)}
          </div>

          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line">${ad.description}</p>

          <!-- Seller info -->
          <div class="mt-auto border-t border-gray-100 dark:border-dark-border pt-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <img src="${user?.avatar}" class="w-12 h-12 rounded-full border-2 border-primary-100 dark:border-primary-900/50" alt="${user?.name}">
                <div class="ml-4">
                  <p class="font-bold text-gray-900 dark:text-white">${user?.name}</p>
                  <div class="flex items-center text-sm text-amber-500">
                    <svg class="w-4 h-4 mr-1 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    <span class="font-bold">${ratingAvg}</span>
                    <span class="text-gray-500 dark:text-gray-400 ml-1">(${ratingCount} avis)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-3 relative overflow-visible">
              <button onclick="window.router.navigate('chat', { sellerId: '${user?.id}', adId: '${ad.id}' })" class="btn bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/20 flex-1 flex justify-center items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                Contacter le vendeur
              </button>
              
              <!-- Bouton Évaluer avec Hover Menu -->
              <div class="relative group flex-none">
                <button class="btn btn-outline border-slate-200 dark:border-dark-border w-full flex items-center justify-center hover:text-amber-500 hover:border-amber-500 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                </button>
                <div class="absolute bottom-full -left-16 hidden group-hover:block pb-2 z-50">
                  <div class="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-dark-border p-2 rounded-lg shadow-2xl flex space-x-1">
                    ${[1, 2, 3, 4, 5].map(s => `<button data-score="${s}" data-seller="${user?.id}" class="star-btn text-gray-300 hover:text-amber-500 focus:text-amber-500 transition-colors"><svg class="w-6 h-6 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg></button>`).join('')}
                  </div>
                </div>
              </div>

              <button id="btn-report-ad" class="btn btn-outline border-slate-200 dark:border-dark-border flex-none px-4 hover:text-red-600 hover:border-red-600 dark:hover:text-red-500 transition-colors" title="Signaler l'annonce">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </button>
            </div>

            <!-- Neo-Digitalism Extensions: AR and Map -->
            <div class="mt-6 grid grid-cols-2 gap-4">
              ${ad.category === 'Vêtements' ? `
                <button id="btn-ar-tryon" class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/5 transition-all group/ar">
                  <div class="w-10 h-10 rounded-full bg-[#00FFFF]/10 flex items-center justify-center mb-2 group-hover/ar:animate-pulse">
                    <svg class="w-6 h-6 text-[#00FFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <span class="text-[10px] font-bold text-white uppercase tracking-widest">Aperçu AR</span>
                </button>
              ` : ''}
              <button id="btn-safe-map" class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group/map">
                <div class="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 group-hover/map:animate-bounce">
                  <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span class="text-[10px] font-bold text-white uppercase tracking-widest">Safe Zones</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- AR Overlay Modal -->
      <div id="ar-overlay" class="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md hidden flex-col items-center justify-center p-4">
        <div class="relative w-full max-w-lg aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,255,255,0.2)]">
          <img src="${ad.imageUrl}" class="w-full h-full object-cover grayscale opacity-50">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          <!-- Scanning Line -->
          <div id="ar-scan-line" class="absolute top-0 left-0 w-full h-1 bg-[#00FFFF] shadow-[0_0_15px_#00FFFF] animate-scan-line"></div>
          
          <!-- HUD Elements -->
          <div class="absolute top-10 left-10 text-[#00FFFF] font-mono text-[10px] space-y-1">
             <div id="ar-status-hud">
               <p class="animate-pulse">ANALYSING MESH...</p>
               <p>SOURCE_IMG: REF_0982</p>
               <p>DEPTH_MAP: CALCULATING...</p>
             </div>
             <div id="ar-result-hud" class="hidden text-emerald-400">
               <p class="font-black">SCAN COMPLETED</p>
               <p>MATCH_CONFIDENCE: 99.4%</p>
               <p>SIZE_REC: MEDIUM (SLIM FIT)</p>
             </div>
          </div>
          
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center w-full px-10">
            <div id="ar-action-area">
              <h4 class="text-white font-display font-bold text-xl mb-2">Simulation AR</h4>
              <p class="text-white/50 text-xs uppercase tracking-widest mb-6">Patientez pendant le scan...</p>
              <div class="flex justify-center">
                <div class="w-12 h-12 border-4 border-[#00FFFF]/20 border-t-[#00FFFF] rounded-full animate-spin"></div>
              </div>
            </div>
            <div id="ar-result-area" class="hidden animate-fade-in">
              <h4 class="text-emerald-400 font-display font-bold text-2xl mb-1">Fit Parfait !</h4>
              <p class="text-white/70 text-[10px] uppercase tracking-widest mb-6">Compatible avec vos mensurations (98%)</p>
              <div class="flex justify-center gap-4">
                <button id="btn-ar-buy" class="px-8 py-3 rounded-xl bg-[#00FFFF] text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,255,255,0.4)]">Acheter Maintenant</button>
              </div>
            </div>
          </div>
        </div>
        <button onclick="document.getElementById('ar-overlay').classList.add('hidden')" class="mt-8 text-white/50 hover:text-white uppercase tracking-[0.4em] text-xs font-black">Quitter le scan</button>
      </div>

      <!-- Safe Map Overlay Modal -->
      <div id="map-overlay" class="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md hidden flex-col items-center justify-center p-4">
        <div class="w-full max-w-4xl h-[600px] glass dark:bg-[#0a0a0a]/80 rounded-[3rem] border-white/5 overflow-hidden flex flex-col shadow-2xl relative">
          <div class="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
             <div>
                <h3 class="text-2xl font-display font-bold text-white mb-1">Tangier Radar Map</h3>
                <p class="text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">Zones sécurisées à Tanger détectées</p>
             </div>
             <button onclick="document.getElementById('map-overlay').classList.add('hidden')" class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
             </button>
          </div>
          
          <div class="flex-grow relative bg-[#050505] overflow-hidden">
             <!-- Real Satellite Map of Tangier -->
             <img src="/tangier_satellite_map_dark_1777058968951.png" class="absolute inset-0 w-full h-full object-cover opacity-80">
             <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
             <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(circle, #333 1px, transparent 1px); background-size: 30px 30px;"></div>
             
             <!-- Safe Zone Pins (Tangier Locations) -->
             <div class="absolute top-[40%] left-[55%] group/pin">
                <div class="w-6 h-6 bg-emerald-500 rounded-full animate-ping absolute"></div>
                <div class="w-6 h-6 bg-emerald-500 rounded-full relative shadow-[0_0_20px_#10b981] flex items-center justify-center border-2 border-white/20">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path></svg>
                </div>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all scale-95 group-hover/pin:scale-100 z-50">
                   <div class="flex items-center gap-2 mb-1">
                     <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                     <p class="text-white font-bold text-xs">Tanger City Center</p>
                   </div>
                   <p class="text-white/50 text-[10px] ml-4">🚶 5 min • Sécurité Mall 24h/24</p>
                </div>
             </div>

             <div class="absolute top-[65%] left-[30%] group/pin">
                <div class="w-6 h-6 bg-emerald-500 rounded-full relative shadow-[0_0_20px_#10b981] flex items-center justify-center border-2 border-white/20">
                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"></path></svg>
                </div>
                <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-all scale-95 group-hover/pin:scale-100 z-50">
                   <div class="flex items-center gap-2 mb-1">
                     <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                     <p class="text-white font-bold text-xs">Faculté des Sciences (FST)</p>
                   </div>
                   <p class="text-white/50 text-[10px] ml-4">🚶 12 min • Zone Étudiante Sécurisée</p>
                </div>
             </div>

             <!-- User Location -->
             <div class="absolute bottom-[25%] right-[35%]">
                <div class="w-10 h-10 bg-[#0047FF]/20 rounded-full flex items-center justify-center">
                  <div class="w-4 h-4 bg-[#0047FF] rounded-full border-4 border-white shadow-[0_0_30px_#0047FF]"></div>
                </div>
                <div class="mt-2 bg-[#0047FF] text-white font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tighter mx-auto w-fit">Vous</div>
             </div>
          </div>
          
          <div class="p-8 bg-white/5 grid grid-cols-3 gap-6">
             <div class="text-center">
                <p class="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Confiance</p>
                <p class="text-emerald-500 font-display font-bold text-xl">NIVEAU A+</p>
             </div>
             <div class="text-center border-x border-white/5">
                <p class="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Espaces</p>
                <p class="text-white font-display font-bold text-xl">4 ZONES</p>
             </div>
             <div class="text-center">
                <p class="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">Surveillance</p>
                <p class="text-white font-display font-bold text-xl">24/7</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Nous devons ajouter un listener pour le signalement après le rendu
export function setupDetailsLogic(id: string) {
  setTimeout(() => {
    document.getElementById('btn-report-ad')?.addEventListener('click', async () => {
      const isConfirmed = await window.router.components.showConfirm('Signaler ?', 'Voulez-vous vraiment signaler cette annonce ?', 'warning');
      if (isConfirmed) {
        import('../store.ts').then(({ updateAdStatus }) => {
          updateAdStatus(id, 'reported');
          window.router.components.showToast('Annonce signalée. Elle sera vérifiée.', 'info');
        });
      }
    });

    document.getElementById('btn-ar-tryon')?.addEventListener('click', () => {
      const overlay = document.getElementById('ar-overlay');
      overlay?.classList.remove('hidden');
      
      // Simulate scan sequence
      const statusHud = document.getElementById('ar-status-hud');
      const resultHud = document.getElementById('ar-result-hud');
      const actionArea = document.getElementById('ar-action-area');
      const resultArea = document.getElementById('ar-result-area');
      const scanLine = document.getElementById('ar-scan-line');

      // Reset
      statusHud?.classList.remove('hidden');
      resultHud?.classList.add('hidden');
      actionArea?.classList.remove('hidden');
      resultArea?.classList.add('hidden');
      if (scanLine) scanLine.style.animationPlayState = 'running';

      setTimeout(() => {
        statusHud?.classList.add('hidden');
        resultHud?.classList.remove('hidden');
        actionArea?.classList.add('hidden');
        resultArea?.classList.remove('hidden');
        if (scanLine) scanLine.style.animationPlayState = 'paused';
      }, 3500);
    });

    document.getElementById('btn-ar-buy')?.addEventListener('click', () => {
      import('../store.ts').then(({ getAdById }) => {
        const ad = getAdById(id);
        if (ad) {
          window.router.navigate('chat', { 
            sellerId: ad.userId, 
            adId: ad.id, 
            initialMsg: 'Bonjour, est-ce que ce produit est toujours disponible ?' 
          });
        }
      });
    });

    document.getElementById('btn-safe-map')?.addEventListener('click', () => {
      document.getElementById('map-overlay')?.classList.remove('hidden');
    });

    document.querySelectorAll('.star-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const score = parseInt((e.currentTarget as HTMLElement).getAttribute('data-score') || '0');
        const sellerId = (e.currentTarget as HTMLElement).getAttribute('data-seller');
        
        import('../store.ts').then(({ currentUserId, rateUser }) => {
          if (!currentUserId) {
            window.router.components.showToast('Connectez-vous pour évaluer.', 'info');
            return;
          }
          if (sellerId) {
            rateUser(sellerId, currentUserId, score);
            window.router.components.showToast(`Vous avez donné ${score} étoiles !`, 'success');
            // Re-render pour afficher la nouvelle note moyenne (hack simple)
            window.router.navigate('details', { id });
          }
        });
      });
    });
  }, 100);
}
