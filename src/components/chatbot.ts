import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const token = import.meta.env.VITE_GITHUB_TOKEN || ""; // Use Vite environment variable
const endpoint = "https://models.github.ai/inference";
const model = "mistral-ai/mistral-medium-2505";

export function setupChatbot() {
  const container = document.createElement('div');
  container.id = 'chatbot-wrapper';
  container.className = 'fixed bottom-6 right-6 z-[100] pointer-events-none';

  container.innerHTML = `
    <div id="chatbot-modal" class="hidden flex-col w-[380px] h-[550px] glass dark:bg-[#0a0a0a]/80 border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mb-4 transition-all duration-500 transform origin-bottom-right scale-95 opacity-0 pointer-events-auto">
      <div class="bg-gradient-to-r from-[#0047FF] to-[#8000FF] p-5 flex justify-between items-center text-white">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </div>
          <div>
            <h3 class="font-display font-bold text-lg leading-none">MIGO</h3>
            <p class="text-[10px] text-white/70 uppercase tracking-widest mt-1">My Intelligent Guide & Observer</p>
          </div>
        </div>
        <button id="chatbot-close" class="p-2 hover:bg-white/10 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <div id="chatbot-messages" class="flex-grow p-6 overflow-y-auto space-y-4 bg-transparent text-sm scrollbar-hide">
        <div class="flex flex-col items-start">
          <div class="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none text-gray-200 max-w-[85%] shadow-sm">
            Bonjour ! Je suis <strong>MIGO</strong>, votre guide intelligent. Comment puis-je propulser votre expérience aujourd'hui ?
          </div>
          <span class="text-[10px] text-white/30 mt-1 ml-1">Maintenant</span>
        </div>
      </div>
      
      <div class="p-4 bg-white/5 border-t border-white/10 backdrop-blur-xl">
        <div class="relative flex items-center">
          <input type="text" id="chatbot-input" 
            class="w-full pl-4 pr-12 py-3 rounded-2xl border border-white/10 bg-black/20 text-white placeholder-white/30 focus:outline-none focus:border-[#0047FF] focus:ring-1 focus:ring-[#0047FF] transition-all" 
            placeholder="Écrivez votre message...">
          <button id="chatbot-send" class="absolute right-2 p-2 bg-[#0047FF] hover:bg-[#0037CC] text-white rounded-xl transition-all shadow-lg shadow-[#0047FF]/20">
             <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          </button>
        </div>
        <p class="text-[9px] text-center text-white/20 mt-3 uppercase tracking-tighter">Powered by Neo-Digitalism Engine</p>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  const toggleBtn = document.getElementById('chatbot-sidebar-toggle');
  const closeBtn = document.getElementById('chatbot-close');
  const modal = document.getElementById('chatbot-modal');
  const input = document.getElementById('chatbot-input') as HTMLInputElement;
  const sendBtn = document.getElementById('chatbot-send');
  const messagesContainer = document.getElementById('chatbot-messages');

  let chatHistory: any[] = [
    { role: 'system', content: 'Tu es un assistant client utile, amical et concis pour une marketplace étudiante appelée StudentMarket. Tu parles français.' }
  ];

  toggleBtn?.addEventListener('click', () => {
    const isHidden = modal?.classList.contains('hidden');
    if (isHidden) {
      modal?.classList.remove('hidden');
      modal?.classList.add('flex');
      setTimeout(() => {
        modal?.classList.remove('opacity-0', 'scale-95');
        modal?.classList.add('opacity-100', 'scale-100');
      }, 10);
    } else {
      modal?.classList.remove('opacity-100', 'scale-100');
      modal?.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        modal?.classList.add('hidden');
        modal?.classList.remove('flex');
      }, 500);
    }
  });

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('opacity-100', 'scale-100');
    modal?.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
      modal?.classList.add('hidden');
      modal?.classList.remove('flex');
    }, 500);
  });

  function appendMessage(role: 'user' | 'assistant', text: string) {
    const wrapper = document.createElement('div');
    wrapper.className = `flex flex-col ${role === 'user' ? 'items-end' : 'items-start'}`;

    const div = document.createElement('div');
    if (role === 'user') {
      div.className = 'bg-[#0047FF] text-white p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[85%]';
    } else {
      div.className = 'bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl rounded-tl-none text-gray-200 max-w-[85%] shadow-sm whitespace-pre-line';
    }
    div.textContent = text;

    const time = document.createElement('span');
    time.className = 'text-[10px] text-white/30 mt-1 mx-1';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    wrapper.appendChild(div);
    wrapper.appendChild(time);
    messagesContainer?.appendChild(wrapper);

    if (messagesContainer) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: 'smooth'
      });
    }
  }

  const client = token ? ModelClient(endpoint, new AzureKeyCredential(token)) : null;

  function offlineReply(text: string): string {
    const t = text.toLowerCase();
    if (/(bonjour|salut|hello|coucou)/.test(t)) return "Bonjour ! Je peux vous aider à explorer le catalogue, créer une annonce ou répondre à vos questions sur StudentMarket.";
    if (/(prix|tarif|combien)/.test(t)) return "Vous pouvez filtrer le catalogue par fourchette de prix dans la barre latérale gauche du catalogue.";
    if (/(vendre|publier|annonce)/.test(t)) return "Pour publier une annonce, ouvrez votre tableau de bord puis cliquez sur \"Publier une annonce\".";
    if (/(zone|safe|sécurité|securite)/.test(t)) return "Sur la page d'une annonce, le bouton \"Safe Zones\" affiche les lieux d'échange recommandés sur le campus.";
    if (/(karma|badge)/.test(t)) return "Le Digital Karma augmente avec vos ventes et avis positifs. Les badges récompensent vos actions clés !";
    return "Je suis en mode hors-ligne (clé IA non configurée), mais voici quelques pistes : essayez la recherche (⌘K), explorez le catalogue, ou consultez vos notifications. 🛰️";
  }

  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });
    input.value = '';

    // Typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'text-gray-500 text-xs italic';
    typingDiv.textContent = 'MIGO écrit...';
    messagesContainer?.appendChild(typingDiv);

    if (!client) {
      setTimeout(() => {
        typingDiv.remove();
        const reply = offlineReply(text);
        appendMessage('assistant', reply);
        chatHistory.push({ role: 'assistant', content: reply });
      }, 600);
      return;
    }

    try {
      const response = await client.path("/chat/completions").post({
        body: {
          messages: chatHistory,
          temperature: 0.7,
          max_tokens: 500,
          model: model
        }
      });

      typingDiv.remove();

      if (isUnexpected(response)) {
        throw response.body.error;
      }

      const reply = response.body.choices[0].message.content || "";

      appendMessage('assistant', reply);
      chatHistory.push({ role: 'assistant', content: reply });

    } catch (e) {
      typingDiv.remove();
      console.error(e);
      appendMessage('assistant', 'Désolé, une erreur de connexion est survenue.');
    }
  }

  sendBtn?.addEventListener('click', handleSend);
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
}
