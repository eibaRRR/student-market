import { getAds, getRecentlyViewedAds } from '../store.ts';
import { formatPrice } from '../utils.ts';
import { createAdCard } from '../components.ts';

export function renderHome(): string {
  const latestAds = getAds()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);
  const recent = getRecentlyViewedAds().slice(0, 4);

  return `
    <!-- Ethereal Ghost Background Elements (Full Screen) -->
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none flex items-center justify-center">
      <div class="relative w-full h-full max-w-[100vw] max-h-[100vh]">
        <!-- Floating elements positioned with % to be responsive and organic -->
        <div class="absolute top-[15%] left-[5%] animate-levitate opacity-[0.15] blur-[1.5px] -rotate-6" style="animation-duration: 8s; animation-delay: 0s;">
          <div class="glass-panel px-4 py-2 rounded-full border border-[#00FFFF]/20 text-sm font-mono text-[#00FFFF]">
            💻 Macbook Air M1 - Vendu en 15m
          </div>
        </div>
        <div class="absolute top-[25%] right-[8%] animate-levitate opacity-10 blur-[2px] rotate-3" style="animation-duration: 10s; animation-delay: 2s;">
          <div class="glass-panel px-4 py-2 rounded-xl border border-white/5 text-xs text-white">
            "Vendeur super sympa ! ⭐⭐⭐⭐⭐"
          </div>
        </div>
        <div class="absolute bottom-[40%] left-[12%] animate-levitate opacity-[0.15] blur-[1px] rotate-12" style="animation-duration: 12s; animation-delay: 4s;">
           <span class="text-4xl filter drop-shadow-[0_0_10px_rgba(255,50,50,0.5)]">🔥</span>
        </div>
        <div class="absolute bottom-[25%] right-[15%] animate-levitate opacity-[0.20] blur-[1.5px] -rotate-3" style="animation-duration: 9s; animation-delay: 1s;">
          <div class="glass-panel px-5 py-3 rounded-2xl border border-[#8000FF]/30 text-sm font-bold text-[#8000FF] shadow-[0_0_15px_rgba(128,0,255,0.3)]">
            📚 Lot livres Med L1 - 50€
          </div>
        </div>
        <div class="absolute top-[8%] right-[40%] animate-levitate opacity-10 blur-[2.5px] rotate-6" style="animation-duration: 11s; animation-delay: 3s;">
          <div class="glass-panel px-3 py-1.5 rounded-full border border-white/5 text-xs text-slate-300">
            ❤️ 24 étudiants intéressés
          </div>
        </div>
        <div class="absolute bottom-[15%] left-[30%] animate-levitate opacity-[0.12] blur-[1.5px] -rotate-12" style="animation-duration: 14s; animation-delay: 5s;">
          <div class="glass-panel px-4 py-2 rounded-lg border border-[#0047FF]/20 text-xs text-[#0047FF]">
            "Transaction parfaite sur le campus."
          </div>
        </div>
        <div class="absolute top-[45%] left-[2%] animate-levitate opacity-[0.08] blur-[3px]" style="animation-duration: 15s; animation-delay: 1.5s;">
           <span class="text-6xl text-white">📦</span>
        </div>
        <div class="absolute top-[55%] right-[5%] animate-levitate opacity-[0.08] blur-[2px] -rotate-12" style="animation-duration: 13s; animation-delay: 2.5s;">
           <span class="text-5xl text-white">✨</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="h-full flex flex-col justify-center animate-fade-in relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      
      <!-- Immersive Canvas Hero -->
      <div class="flex flex-col items-center text-center relative z-20">
        <h1 class="text-7xl md:text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 leading-[0.9] tracking-tighter mb-6 neon-text-glow">
          DÉBLOQUEZ <br/>
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-[#0047FF] via-[#8000FF] to-[#00FFFF]">L'ÉCONOMIE DU CAMPUS.</span>
        </h1>
        <p class="text-xl md:text-2xl font-light text-slate-400 mb-12 max-w-2xl">
          Découvrez et échangez l'essentiel pour étudiants, soigneusement sélectionné.
        </p>
        <button onclick="window.router.navigate('catalog')" class="btn glass-panel border border-[#0047FF]/50 text-white hover:bg-[#0047FF]/20 px-10 py-5 text-xl rounded-full shadow-[0_0_30px_rgba(0,71,255,0.4)] hover:shadow-[0_0_50px_rgba(0,71,255,0.8)] transition-all hover:scale-105">
          Explorer le marché
        </button>
      </div>

      <!-- Orbiting Product Cards (3D grid illusion) -->
      <div class="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 w-full perspective-1000">
        ${latestAds.map((ad, i) => `
          <div class="glass-panel border border-white/5 rounded-3xl overflow-hidden shadow-2xl transform hover:scale-110 hover:-translate-y-4 hover:rotate-1 transition-all duration-500 animate-levitate cursor-pointer group" style="animation-delay: ${i * 0.5}s;" onclick="window.router.navigate('details', { id: '${ad.id}' })">
            <div class="relative h-48 overflow-hidden bg-black/50">
              <img src="${ad.imageUrl}" alt="${ad.title}" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity">
              <div class="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent"></div>
              <div class="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span class="text-white font-bold text-lg leading-tight line-clamp-1">${ad.title}</span>
                <span class="text-[#00FFFF] font-mono font-bold text-xl drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">${formatPrice(ad.price)}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

      ${recent.length > 0 ? `
      <section class="mt-24 w-full relative z-10">
        <div class="flex items-end justify-between mb-6">
          <div>
            <p class="text-[10px] uppercase tracking-[0.3em] text-[#00FFFF]/80 mb-2">Mémoire neuronale</p>
            <h2 class="text-3xl font-display font-black text-white">Récemment consultées</h2>
          </div>
          <button onclick="window.router.navigate('catalog')" class="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors">Voir le catalogue →</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          ${recent.map(createAdCard).join('')}
        </div>
      </section>
      ` : ''}
    </div>
  `;
}
