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
      <!-- Background Blobs -->
      <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div class="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div class="relative w-full max-w-4xl bg-white/60 dark:bg-dark-card/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden flex flex-col md:flex-row">
        
        <!-- Illustration Section -->
        <div class="hidden md:flex flex-col justify-center items-center w-1/2 p-12 bg-gradient-to-br from-primary-600/90 to-indigo-800/90 text-white relative overflow-hidden">
           <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
           <div class="relative z-10 text-center">
             <h2 class="text-4xl font-display font-extrabold mb-4">Rejoignez le campus !</h2>
             <p class="text-lg opacity-90 mb-8">Vendez, achetez, échangez facilement avec des milliers d'autres étudiants.</p>
             <div class="flex items-center -space-x-4 justify-center mt-4">
                <img class="w-12 h-12 rounded-full border-2 border-primary-500" src="https://i.pravatar.cc/150?u=1" alt="">
                <img class="w-12 h-12 rounded-full border-2 border-primary-500" src="https://i.pravatar.cc/150?u=2" alt="">
                <img class="w-12 h-12 rounded-full border-2 border-primary-500" src="https://i.pravatar.cc/150?u=3" alt="">
                <div class="w-12 h-12 rounded-full border-2 border-primary-500 bg-white text-primary-600 flex items-center justify-center font-bold text-xs">+2k</div>
             </div>
           </div>
        </div>

        <!-- Form Section -->
        <div class="w-full md:w-1/2 p-8 sm:p-12">
          
          <!-- Tabs -->
          <div class="flex mb-8 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button id="tab-login" class="flex-1 py-2 text-sm font-semibold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-primary-600 dark:text-primary-400 transition-all">Connexion</button>
            <button id="tab-signup" class="flex-1 py-2 text-sm font-medium rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 transition-all">Inscription</button>
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
                <a href="#" class="text-xs text-primary-600 dark:text-primary-400 hover:underline">Oublié ?</a>
              </div>
              <input type="password" id="login-pass" required class="input-field" placeholder="••••••••" value="password123">
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
              <input type="password" id="signup-pass" required class="input-field" placeholder="Créer un mot de passe">
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

  // Toggle Setup
  tabLogin?.addEventListener('click', () => {
    tabLogin.classList.add('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
    tabLogin.classList.remove('text-gray-500', 'hover:text-gray-700', 'font-medium');
    tabSignup?.classList.remove('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
    tabSignup?.classList.add('text-gray-500', 'hover:text-gray-700', 'font-medium');
    formLogin?.classList.remove('hidden');
    formSignup?.classList.add('hidden');
  });

  tabSignup?.addEventListener('click', () => {
    tabSignup.classList.add('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
    tabSignup.classList.remove('text-gray-500', 'hover:text-gray-700', 'font-medium');
    tabLogin?.classList.remove('bg-white', 'dark:bg-gray-700', 'shadow-sm', 'text-primary-600', 'dark:text-primary-400', 'font-semibold');
    tabLogin?.classList.add('text-gray-500', 'hover:text-gray-700', 'font-medium');
    formSignup?.classList.remove('hidden');
    formLogin?.classList.add('hidden');
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
}
