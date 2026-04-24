import { getUserAds, currentUserId, categories, conditions, getUserFavorites, getCurrentUser, updateUserAvatar } from '../store.ts';
import { formatPrice, formatDate, showToast } from '../utils.ts';
import { Ad } from '../types.ts';
import { createAdCard } from '../components.ts';

export function renderStudentDashboard(): string {
  if (!currentUserId) return '<div class="text-center py-20">Veuillez vous connecter.</div>';

  const user = getCurrentUser();
  if (!user) return '<div class="text-center py-20">Veuillez vous connecter.</div>';

  // Ensure karma and badges exist for older users in localStorage
  const karma = user.karma || 0;
  const badges = user.badges || [];

  const myAds = getUserAds(user.id);
  const myFavs = getUserFavorites(user.id);
  const activeCount = myAds.filter(ad => ad.status === 'active' || ad.status === 'reserved').length;
  const soldCount = myAds.filter(ad => ad.status === 'sold').length;

  return `
    <div class="animate-fade-in max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
      
      <!-- User profile summary sidebar -->
      <aside class="w-full md:w-1/3 lg:w-1/4">
        <div class="glass dark:bg-[#0a0a0a]/60 rounded-3xl p-8 shadow-2xl border-white/5 sticky top-24 text-center">
          <div class="relative w-28 h-28 mx-auto mb-6">
            <img src="${user.avatar}" class="w-full h-full rounded-3xl object-cover border-2 border-white/10" alt="Profil">
            <button id="change-avatar-btn" class="absolute inset-0 w-full h-full rounded-3xl bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[8px] font-bold uppercase tracking-widest border border-white/10">
              <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Importer
            </button>
            <input type="file" id="avatar-upload" accept="image/*" class="hidden">
            ${karma > 500 ? '<div class="absolute -inset-2 bg-gradient-to-tr from-[#0047FF] to-[#8000FF] rounded-[2rem] -z-10 blur-md opacity-50"></div>' : ''}
            <div class="absolute -bottom-2 -right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-[#050505] shadow-lg"></div>
          </div>
          
          <h2 class="text-2xl font-display font-bold text-white mb-1">${user.name}</h2>
          <p class="text-white/40 text-xs uppercase tracking-widest mb-6">${user.email}</p>
          
          <!-- Digital Karma Section -->
          <div class="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
            <div class="flex justify-between items-center mb-3">
              <span class="text-[10px] font-black text-white/40 uppercase tracking-tighter">Digital Karma</span>
              <span class="text-xs font-bold text-primary-400">${karma} XP</span>
            </div>
            <div class="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
               <div class="bg-gradient-to-r from-[#0047FF] to-[#8000FF] h-full rounded-full" style="width: ${Math.min((karma / 1000) * 100, 100)}%"></div>
            </div>
            
            <div class="flex flex-wrap justify-center gap-2 mt-4">
              ${badges.map(b => `
                <div class="group relative">
                  <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:scale-110 transition-all cursor-help hover:bg-white/10 hover:border-white/20">
                    ${b.icon}
                  </div>
                  <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#0a0a0a] border border-white/10 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-2xl">
                    <span class="font-bold text-primary-400">${b.name}</span><br>
                    <span class="text-white/50 uppercase text-[8px] tracking-widest">${b.rarity}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
            <div>
              <p class="text-2xl font-display font-bold text-white">${activeCount}</p>
              <p class="text-[10px] text-white/40 uppercase tracking-widest">Actives</p>
            </div>
            <div>
              <p class="text-2xl font-display font-bold text-emerald-500">${soldCount}</p>
              <p class="text-[10px] text-white/40 uppercase tracking-widest">Vendus</p>
            </div>
          </div>
          
          <button id="show-add-form" class="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-[#0047FF] to-[#8000FF] text-white font-bold text-sm shadow-[0_10px_20px_rgba(0,71,255,0.3)] hover:shadow-[0_10px_30px_rgba(0,71,255,0.5)] hover:-translate-y-1 transition-all flex justify-center items-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
            Publier sur le Market
          </button>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="w-full md:w-2/3 lg:w-3/4">
        
        <!-- Add ad Form (hidden by default) -->
        <div id="add-ad-container" class="hidden mb-8 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
          <div class="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 id="form-title" class="text-2xl font-display font-bold text-slate-900 dark:text-white">Publier une annonce</h2>
            <button id="cancel-add-form" class="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Fermer</button>
          </div>
          
          <form id="add-ad-form" class="space-y-5">
            <input type="hidden" id="edit-ad-id" value="">
            <div>
              <label class="label-field">Titre de l'annonce</label>
              <input type="text" id="ad-title" required class="input-field" placeholder="Ex: Livre Maths L1 très bon état">
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label class="label-field">Prix (€)</label>
                <input type="number" id="ad-price" required min="0" step="0.01" class="input-field" placeholder="0.00">
              </div>
              <div>
                <label class="label-field">Catégorie</label>
                <select id="ad-category" required class="input-field">
                  ${categories.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
            </div>

            <div>
              <label class="label-field">État</label>
              <select id="ad-condition" required class="input-field">
                ${conditions.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            
            <div>
              <label class="label-field">URL de l'image (optionnel)</label>
              <input type="url" id="ad-image" class="input-field" placeholder="https://...">
              <p class="text-xs text-gray-500 mt-1">Laissez vide pour utiliser une image par défaut.</p>
            </div>
            
            <div>
              <label class="label-field">Description</label>
              <textarea id="ad-description" required rows="4" class="input-field" placeholder="Décrivez votre article en détail..."></textarea>
            </div>
            
            <div class="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5">
              <div class="flex items-center h-5">
                <input id="ad-is-service" type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
              </div>
              <div class="ml-3 text-sm">
                <label for="ad-is-service" class="font-bold text-white uppercase tracking-widest text-xs">C'est un Service (Tutorat, Aide, etc.)</label>
                <p class="text-white/40 text-[10px]">Cochez cette case si vous proposez une aide plutôt qu'un objet physique.</p>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button type="submit" id="submit-ad-btn" class="btn btn-primary w-full sm:w-auto">Publier maintenant</button>
            </div>
          </form>
        </div>

        <div class="flex border-b border-slate-200 dark:border-dark-border mb-6 overflow-x-auto">
          <button id="tab-my-ads" class="px-6 py-3 font-bold border-b-2 border-primary-600 text-primary-600 whitespace-nowrap">Mes annonces</button>
          <button id="tab-my-favs" class="px-6 py-3 font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors whitespace-nowrap">Mes favoris (${myFavs.length})</button>
        </div>

        <!-- My Ads List -->
        <div id="my-ads-section">
          <div id="my-ads-list" class="space-y-4">
            ${renderMyAdsList(myAds)}
          </div>
        </div>

        <!-- My Favs List -->
        <div id="my-favs-section" class="hidden">
          ${myFavs.length === 0 ?
      `<div class="text-center py-10 bg-gray-50 dark:bg-[#1a1a1a] rounded-xl border border-dashed border-gray-300 dark:border-dark-border">
              <p class="text-gray-500 dark:text-gray-400">Vous n'avez pas encore d'annonces en favoris.</p>
             </div>` :
      `<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              ${myFavs.map(createAdCard).join('')}
             </div>`
    }
        </div>

      </div>
    </div>
  `;
}

function renderMyAdsList(ads: Ad[]): string {
  if (ads.length === 0) {
    return `
      <div class="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">Vous n'avez aucune annonce en ligne.</p>
      </div>
    `;
  }

  return ads.map(ad => `
    <div class="flex flex-col sm:flex-row bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <img src="${ad.imageUrl}" class="w-full sm:w-48 h-32 sm:h-full object-cover" alt="{ad.title}">
      <div class="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div class="flex justify-between items-start">
            <h3 class="font-display font-bold text-lg text-slate-900 dark:text-white line-clamp-1">${ad.title}</h3>
            <span class="font-bold text-primary-600">${formatPrice(ad.price)}</span>
          </div>
          <p class="text-sm text-slate-500 mt-1 mb-2">Créée le ${formatDate(ad.createdAt)}</p>
          <div class="flex items-center space-x-2">
            <span class="badge ${ad.status === 'active' ? 'bg-emerald-100 text-emerald-800' :
      ad.status === 'sold' ? 'bg-slate-800 text-white' :
        ad.status === 'reserved' ? 'bg-blue-100 text-blue-800' :
          ad.status === 'pending' ? 'bg-amber-100 text-amber-800' :
            ad.status === 'reported' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'
    }">
              ${ad.status === 'active' ? 'Disponible' : (ad.status === 'sold' ? 'Vendu' : (ad.status === 'reserved' ? 'Réservé' : (ad.status === 'pending' ? 'En attente admin' : 'Signalée')))}
            </span>
            <span class="text-xs text-slate-500 font-medium flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              ${ad.views} vues
            </span>
          </div>
        </div>
        <div class="mt-4 flex flex-col sm:flex-row gap-3 justify-between items-center border-t border-slate-50 dark:border-slate-800 pt-3">
          <select data-status-id="${ad.id}" class="status-select bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-dark-border text-sm rounded-lg px-2 py-1 text-slate-700 dark:text-slate-300">
            <option value="active" ${ad.status === 'active' ? 'selected' : ''}>Marquer Disponible</option>
            <option value="reserved" ${ad.status === 'reserved' ? 'selected' : ''}>Marquer Réservé</option>
            <option value="sold" ${ad.status === 'sold' ? 'selected' : ''}>Marquer Vendu</option>
          </select>
          <div class="flex space-x-3">
            <button data-edit-id="${ad.id}" class="edit-ad-btn text-sm font-medium text-slate-600 hover:text-primary-600 dark:text-slate-400 transition-colors">Modifier</button>
            <button data-delete-id="${ad.id}" class="delete-ad-btn text-sm font-medium text-red-600 hover:text-red-800 transition-colors">Supprimer</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

export function setupStudentLogic(params?: any) {
  const showBtn = document.getElementById('show-add-form');
  const cancelBtn = document.getElementById('cancel-add-form');
  const formContainer = document.getElementById('add-ad-container');
  const form = document.getElementById('add-ad-form') as HTMLFormElement;
  const listContainer = document.getElementById('my-ads-list');
  const formTitle = document.getElementById('form-title');
  const submitBtn = document.getElementById('submit-ad-btn');

  const tabAds = document.getElementById('tab-my-ads');
  const tabFavs = document.getElementById('tab-my-favs');
  const sectionAds = document.getElementById('my-ads-section');
  const sectionFavs = document.getElementById('my-favs-section');

  tabAds?.addEventListener('click', () => {
    tabAds.classList.add('border-primary-600', 'text-primary-600');
    tabAds.classList.remove('border-transparent', 'text-slate-500');
    tabFavs?.classList.add('border-transparent', 'text-slate-500');
    tabFavs?.classList.remove('border-primary-600', 'text-primary-600');

    sectionAds?.classList.remove('hidden');
    sectionFavs?.classList.add('hidden');
  });

  tabFavs?.addEventListener('click', () => {
    tabFavs.classList.add('border-primary-600', 'text-primary-600');
    tabFavs.classList.remove('border-transparent', 'text-slate-500');
    tabAds?.classList.add('border-transparent', 'text-slate-500');
    tabAds?.classList.remove('border-primary-600', 'text-primary-600');

    sectionFavs?.classList.remove('hidden');
    sectionAds?.classList.add('hidden');
  });

  // Logic for changing avatar from local file
  const avatarBtn = document.getElementById('change-avatar-btn');
  const avatarInput = document.getElementById('avatar-upload') as HTMLInputElement;

  avatarBtn?.addEventListener('click', () => {
    avatarInput?.click();
  });

  avatarInput?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        window.router.components.showToast('L\'image est trop lourde (max 2Mo).', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        if (currentUserId) {
          updateUserAvatar(currentUserId, base64String);
          window.router.components.showToast('Photo de profil mise à jour !', 'success');
          window.router.navigate('student'); // Re-render
        }
      };
      reader.readAsDataURL(file);
    }
  });

  function resetFormUI() {
    form.reset();
    (document.getElementById('edit-ad-id') as HTMLInputElement).value = '';
    if (formTitle) formTitle.textContent = 'Publier une annonce';
    if (submitBtn) submitBtn.textContent = 'Publier maintenant';
  }

  showBtn?.addEventListener('click', () => {
    resetFormUI();
    formContainer?.classList.remove('hidden');
    formContainer?.scrollIntoView({ behavior: 'smooth' });
  });

  cancelBtn?.addEventListener('click', () => {
    formContainer?.classList.add('hidden');
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!currentUserId) return;

    const id = (document.getElementById('edit-ad-id') as HTMLInputElement).value;
    const title = (document.getElementById('ad-title') as HTMLInputElement).value;
    const price = parseFloat((document.getElementById('ad-price') as HTMLInputElement).value);
    const category = (document.getElementById('ad-category') as HTMLSelectElement).value as any;
    const condition = (document.getElementById('ad-condition') as HTMLSelectElement).value as any;
    const description = (document.getElementById('ad-description') as HTMLInputElement).value;
    const isService = (document.getElementById('ad-is-service') as HTMLInputElement).checked;
    const imageUrl = (document.getElementById('ad-image') as HTMLInputElement).value || 'https://images.unsplash.com/photo-1555661530-68c8e98db4e6?auto=format&fit=crop&q=80&w=800';

    if (id) {
      // Edit mode
      import('../store.ts').then(({ editAd }) => {
        editAd(id, { title, price, category, condition, description, imageUrl, isService });
        showToast('Annonce modifiée avec succès !', 'success');
        finishSubmit();
      });
    } else {
      // Add mode
      import('../store.ts').then(({ addAd }) => {
        addAd({ title, price, category, condition, description, imageUrl, userId: currentUserId!, isService });
        showToast('Votre annonce a été publiée avec succès !', 'success');
        finishSubmit();
      });
    }

    function finishSubmit() {
      resetFormUI();
      formContainer?.classList.add('hidden');

      if (listContainer) {
        import('../store.ts').then(({ getUserAds }) => {
          listContainer.innerHTML = renderMyAdsList(getUserAds(currentUserId!));
          setupDynamicButtons();
        });
      }
    }
  });

  function setupDynamicButtons() {
    // Delete logic
    document.querySelectorAll('.delete-ad-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-delete-id');
        if (id) {
          const isConfirmed = await window.router.components.showConfirm('Supprimer ?', 'Êtes-vous sûr de vouloir supprimer cette annonce ?', 'danger');
          if (isConfirmed) {
            import('../store.ts').then(({ deleteAd, getUserAds }) => {
              deleteAd(id);
              window.router.components.showToast('Annonce supprimée.', 'success');
              if (listContainer) {
                listContainer.innerHTML = renderMyAdsList(getUserAds(currentUserId!));
                setupDynamicButtons();
              }
            });
          }
        }
      });
    });

    // Edit logic
    document.querySelectorAll('.edit-ad-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-edit-id');
        if (!id) return;

        import('../store.ts').then(({ getAdById }) => {
          const adToEdit = getAdById(id);
          if (adToEdit) {
            (document.getElementById('edit-ad-id') as HTMLInputElement).value = adToEdit.id;
            (document.getElementById('ad-title') as HTMLInputElement).value = adToEdit.title;
            (document.getElementById('ad-price') as HTMLInputElement).value = adToEdit.price.toString();
            (document.getElementById('ad-category') as HTMLSelectElement).value = adToEdit.category;
            (document.getElementById('ad-condition') as HTMLSelectElement).value = adToEdit.condition;
            (document.getElementById('ad-description') as HTMLInputElement).value = adToEdit.description;
            (document.getElementById('ad-image') as HTMLInputElement).value = adToEdit.imageUrl;

            if (formTitle) formTitle.textContent = 'Modifier l\'annonce';
            if (submitBtn) submitBtn.textContent = 'Enregistrer les modifications';

            formContainer?.classList.remove('hidden');
            formContainer?.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    });

    // Change status logic
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = (e.currentTarget as HTMLElement).getAttribute('data-status-id');
        const newStatus = (e.currentTarget as HTMLSelectElement).value as any;
        if (id) {
          import('../store.ts').then(({ updateAdStatus }) => {
            updateAdStatus(id, newStatus);
            window.router.components.showToast('Statut mis à jour.', 'success');
            // Re-render completely to update the sidebar counts
            window.router.navigate('student');
          });
        }
      });
    });
  }

  setupDynamicButtons();

  if (params?.tab === 'publish') {
    setTimeout(() => {
      showBtn?.click();
    }, 50);
  }
}
