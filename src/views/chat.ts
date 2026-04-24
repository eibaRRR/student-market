import { getMessages, sendMessage, getUserById, getAdById, currentUserId } from '../store.ts';


export function renderChat(params: { sellerId: string, adId: string, initialMsg?: string }): string {
  if (!currentUserId) {
    return `<div class="text-center py-20 text-xl font-medium text-gray-500">Veuillez vous connecter pour accéder à la messagerie.</div>`;
  }

  const seller = getUserById(params.sellerId);
  const ad = getAdById(params.adId);

  if (!seller || !ad) {
    return `<div class="text-center py-20 text-xl font-medium text-gray-500">Conversation introuvable.</div>`;
  }

  return `
    <div class="animate-fade-in max-w-4xl mx-auto flex flex-col h-[70vh] bg-white dark:bg-[#111111] rounded-2xl border border-gray-200 dark:border-dark-border shadow-lg overflow-hidden">
      
      <!-- Chat Header -->
      <div class="p-4 border-b border-gray-200 dark:border-dark-border bg-slate-50 dark:bg-[#1a1a1a] flex items-center justify-between">
        <div class="flex items-center">
          <button onclick="window.history.back()" class="mr-4 text-gray-500 hover:text-primary-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <img src="${seller.avatar}" class="w-10 h-10 rounded-full mr-3" alt="${seller.name}">
          <div>
            <h3 class="font-bold text-gray-900 dark:text-white">${seller.name}</h3>
            <p class="text-xs text-gray-500 line-clamp-1">Annonce : ${ad.title}</p>
          </div>
        </div>
        <img src="${ad.imageUrl}" class="w-12 h-12 rounded-lg object-cover" alt="">
      </div>

      <!-- Messages Area -->
      <div id="chat-messages-container" class="flex-grow p-4 overflow-y-auto bg-gray-50 dark:bg-[#0a0a0a] flex flex-col space-y-4">
        <!-- Injected via JS -->
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white dark:bg-[#111111] border-t border-gray-200 dark:border-dark-border flex items-center space-x-3">
        <input type="text" id="chat-input" class="input-field flex-grow rounded-full" placeholder="Écrivez un message à ${seller.name}...">
        <button id="chat-send-btn" class="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors focus:ring-4 focus:ring-primary-500/30">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </div>

    </div>
  `;
}

export function setupChatLogic(params: { sellerId: string, adId: string, initialMsg?: string }) {
  const container = document.getElementById('chat-messages-container');
  const input = document.getElementById('chat-input') as HTMLInputElement;
  const sendBtn = document.getElementById('chat-send-btn');

  if (!currentUserId || !container || !input) return;

  const receiverId = params.sellerId;
  const adId = params.adId;

  function renderMessages() {
    const msgs = getMessages(currentUserId!, receiverId, adId);
    if (msgs.length === 0) {
      container!.innerHTML = `<p class="text-center text-gray-500 text-sm mt-10">Envoyez le premier message pour commencer la discussion.</p>`;
      return;
    }

    container!.innerHTML = msgs.map(m => {
      const isMe = m.senderId === currentUserId;
      return `
        <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
          <div class="max-w-[75%] rounded-2xl px-4 py-2 ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white rounded-bl-none shadow-sm'}">
            <p>${m.content}</p>
            <span class="text-[10px] ${isMe ? 'text-primary-100' : 'text-gray-400'} block mt-1 text-right">${new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      `;
    }).join('');

    container!.scrollTop = container!.scrollHeight;
  }

  function handleSend() {
    const text = input.value.trim();
    if (text) {
      sendMessage(currentUserId!, receiverId, adId, text);
      input.value = '';
      renderMessages();

      // Simulate reply from seller if testing
      setTimeout(() => {
        sendMessage(receiverId, currentUserId!, adId, "Je suis intéressé ! Quand êtes-vous disponible ?");
        renderMessages();
      }, 3000);
    }
  }

  sendBtn?.addEventListener('click', handleSend);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Handle initial message if provided and no previous messages exist
  if (params.initialMsg) {
    const msgs = getMessages(currentUserId!, receiverId, adId);
    if (msgs.length === 0) {
      sendMessage(currentUserId!, receiverId, adId, params.initialMsg);
    }
  }

  renderMessages();
}
