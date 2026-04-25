import { login, signup, getCurrentUser } from '../store.ts';
import { showToast } from '../utils.ts';

export function renderAuth(): string {
  // Optionnel: si déjà connecté, redirige
  if (getCurrentUser()) {
    setTimeout(() => window.router.navigate('student'), 0);
    return '';
  }

  return `
    <div class="animate-fade-in flex flex-col md:flex-row justify-center items-center min-h-[80vh] w-full px-4 relative overflow-hidden">
      <!-- Cyber Aurora -->
      <div class="absolute top-[-15%] left-[-10%] w-[28rem] h-[28rem] bg-[#0047FF] rounded-full filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-[15%] right-[-10%] w-[24rem] h-[24rem] bg-[#8000FF] rounded-full filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-15%] left-[20%] w-[26rem] h-[26rem] bg-[#00FFFF] rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div class="relative w-full max-w-4xl glass-panel rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Illustration Section -->
        <div class="hidden md:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-[#0047FF]/30 via-[#8000FF]/20 to-transparent text-white relative overflow-hidden">
           <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div class="absolute -bottom-32 -left-16 w-72 h-72 bg-[#00FFFF]/30 rounded-full blur-3xl"></div>
           <div class="relative z-10">
             <p class="text-[10px] uppercase tracking-[0.4em] text-[#00FFFF]/80">Neo-Digitalism · Access</p>
             <h2 class="text-4xl font-display font-extrabold mt-4 leading-tight">Rejoignez le campus.<br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0047FF] to-[#00FFFF]">Débloquez l'économie.</span></h2>
             <p class="text-base text-white/70 mt-4 max-w-sm">Vendez, achetez, échangez avec des milliers d'étudiants partout sur le campus de Tanger.</p>
           </div>
           <div class="relative z-10">
             <div class="flex items-center -space-x-4 mt-4">
                <img class="w-12 h-12 rounded-full border-2 border-white/20" src="https://i.pravatar.cc/150?u=1" alt="">
                <img class="w-12 h-12 rounded-full border-2 border-white/20" src="https://i.pravatar.cc/150?u=2" alt="">
                <img class="w-12 h-12 rounded-full border-2 border-white/20" src="https://i.pravatar.cc/150?u=3" alt="">
                <div class="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md text-white flex items-center justify-center font-bold text-xs">+2k</div>
             </div>
             <p class="text-xs text-white/50 mt-3">2k+ étudiants nous ont rejoint cette année</p>
           </div>
        </div>

        <!-- Form Section -->
        <div class="w-full md:w-1/2 p-8 sm:p-12">
          
          <!-- Tabs -->
          <div class="flex mb-8 bg-white/5 border border-white/10 p-1 rounded-2xl">
            <button id="tab-login" class="flex-1 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-[#0047FF] to-[#8000FF] shadow-lg text-white transition-all">Connexion</button>
            <button id="tab-signup" class="flex-1 py-2 text-sm font-medium rounded-xl text-white/60 hover:text-white transition-all">Inscription</button>
          </div>

          <!-- Login Form -->
          <form id="form-login" class="space-y-5 animate-fade-in">
            <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Heureux de vous revoir 👋</h3>
            <div>
              <label class="label-field">Adresse Email Étudiante</label>
              <input type="email" id="login-email" required class="input-field" placeholder="prenom.nom@etu.univ.fr" value="thomas@etu.fr">
            </div>
            <div>
              <div class="flex justify-between">
                <label class="label-field">Mot de passe</label>
                <a href="#" id="forgot-pass-btn" class="text-xs text-primary-600 dark:text-primary-400 hover:underline">Oublié ?</a>
              </div>
              <div class="relative">
                <input type="password" id="login-pass" required class="input-field pr-10" placeholder="••••••••" value="password123">
                <button type="button" data-target="login-pass" aria-label="Afficher / masquer le mot de passe" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full btn btn-primary py-3 text-lg mt-4">Me connecter</button>
          </form>

          <!-- Signup Form -->
          <form id="form-signup" class="space-y-5 hidden animate-fade-in">
            <h3 class="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">Créez votre compte 🚀</h3>
            <div>
              <label class="label-field">Nom et Prénom</label>
              <input type="text" id="signup-name" required class="input-field" placeholder="Ex: Jean Dupont">
            </div>
            <div>
              <label class="label-field">Adresse Email Étudiante</label>
              <input type="email" id="signup-email" required class="input-field" placeholder="prenom.nom@etu.univ.fr">
            </div>
            <div>
              <label class="label-field">Mot de passe</label>
              <div class="relative">
                <input type="password" id="signup-pass" required minlength="6" class="input-field pr-10" placeholder="Créer un mot de passe (6+ caractères)">
                <button type="button" data-target="signup-pass" aria-label="Afficher / masquer le mot de passe" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                </button>
              </div>
            </div>
            <button type="submit" class="w-full btn btn-primary py-3 text-lg mt-4">Créer mon compte</button>
          </form>

        </div>
      </div>
    </div>
  `;
}

export function setupAuthLogic() {
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const formLogin = document.getElementById('form-login');
  const formSignup = document.getElementById('form-signup');

  const ACTIVE_TAB = ['bg-gradient-to-r', 'from-[#0047FF]', 'to-[#8000FF]', 'shadow-lg', 'text-white', 'font-bold'];
  const INACTIVE_TAB = ['text-white/60', 'font-medium'];

  // Toggle Setup
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add(...ACTIVE_TAB);
    tabLogin.classList.remove(...INACTIVE_TAB);
    tabSignup?.classList.remove(...ACTIVE_TAB);
    tabSignup?.classList.add(...INACTIVE_TAB);
    formLogin?.classList.remove('hidden');
    formSignup?.classList.add('hidden');
  });

  tabSignup?.addEventListener('click', () => {
    tabSignup.classList.add(...ACTIVE_TAB);
    tabSignup.classList.remove(...INACTIVE_TAB);
    tabLogin?.classList.remove(...ACTIVE_TAB);
    tabLogin?.classList.add(...INACTIVE_TAB);
    formSignup?.classList.remove('hidden');
    formLogin?.classList.add('hidden');
  });

  // Password visibility toggle
  document.querySelectorAll<HTMLElement>('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      if (!targetId) return;
      const input = document.getElementById(targetId) as HTMLInputElement | null;
      if (!input) return;
      input.type = input.type === 'password' ? 'text' : 'password';
    });
  });

  // Actions
  formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const pass = (document.getElementById('login-pass') as HTMLInputElement).value;

    if (login(email, pass)) {
      showToast('Connexion réussie !', 'success');
      window.router.updateNavbar(); // Refresh Nav
      window.router.navigate('student'); // Go to dashboard
    } else {
      showToast('Email ou mot de passe incorrect.', 'error');
    }
  });

  formSignup?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = (document.getElementById('signup-name') as HTMLInputElement).value;
    const email = (document.getElementById('signup-email') as HTMLInputElement).value;
    const pass = (document.getElementById('signup-pass') as HTMLInputElement).value;

    if (signup(name, email, pass)) {
      showToast('Compte créé avec succès ! Bienvenue.', 'success');
      window.router.updateNavbar();
      window.router.navigate('student');
    } else {
      showToast('Cet email est déjà utilisé.', 'error');
    }
  });

  // Forgot Password
  document.getElementById('forgot-pass-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    showToast('Un lien de réinitialisation a été envoyé à votre adresse email.', 'info');
  });
}
