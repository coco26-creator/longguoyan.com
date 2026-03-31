function initChatbot() {
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  markedScript.defer = true;
  document.head.appendChild(markedScript);

  const chatbotHTML = `
    <button id="chat-open" class="ag-chat-open">Help</button>
    <div id="chat" class="ag-chat-window hidden">
      <div class="ag-chat-header">
        <span class="ag-chat-title">LongGuoYan Support</span>
        <button id="chat-close" class="ag-chat-close">✕</button>
      </div>
      <div id="chat-messages" class="ag-chat-messages"></div>
      <div class="ag-chat-input-area">
        <input id="chat-text" class="ag-chat-input" placeholder="Ask me anything..." />
        <button id="chat-send" class="ag-chat-send">Send</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  const chatOpen = document.getElementById('chat-open');
  const chatClose = document.getElementById('chat-close');
  const chat = document.getElementById('chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatText = document.getElementById('chat-text');
  const chatSend = document.getElementById('chat-send');

  if (chatClose && chat) {
    chatClose.addEventListener('click', () => chat.classList.add('hidden'));
  }

  const knowledgeBase = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening'],
      response: "Hello! Welcome to LongGuoYan. How can I help you discover our premium Jiangxiang baijiu today?"
    },
    {
      keywords: ['product', 'collection', 'series', 'liquor', 'bottles', 'buy'],
      response: "Our premium collection includes:<br><br>• **Cellar Supreme 30** — Pinnacle 30-year aged Jiangxiang<br>• **Dragon Vein 30** — Collector's 30-year vintage<br>• **Dragon Vein 15** — Brussels International Gold Award 2024<br>• **Limited Edition** — Collectible gold-plated dragon bottle<br>• **Mastercraft Supreme** — Imperial yellow glaze, ideal for gifting<br><br>Which one would you like to know more about?"
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach', 'support'],
      response: "You can reach our team at **400-159-1958**. We are available Monday to Friday, 9:00 AM – 6:00 PM (GMT+8)."
    },
    {
      keywords: ['location', 'where', 'address', 'place', 'village', 'visit', 'guizhou'],
      response: "Our distillery is located at **Chun Shu Village, Maotai Town, Renhuai, Guizhou, China** — the world-renowned core production area for sauce-aroma Jiangxiang baijiu."
    },
    {
      keywords: ['heritage', 'history', 'story', 'traditional', 'brew', 'distill', 'maotai', 'founded', '1958', 'time-honored'],
      response: "Founded in **1958** in Maotai Town, LongGuoYan has been recognised as a **Guizhou Time-Honored Brand**. Every product is brewed by national-level distilling masters using locally-grown Hongyingzi glutinous sorghum, wheat, and natural Guizhou water — following pure-grain, solid-state fermentation craftsmanship passed down through generations."
    },
    {
      keywords: ['cellar', 'supreme', 'aged', 'years', 'dragon vein', '30', '15'],
      response: "**Our Aged Collection:**\n\n• **Cellar Supreme 30** — Nine rounds of steaming, eight of fermentation, seven of extraction. Sealed in ceramic vats and aged naturally. Dragon-scale relief bottle with leather and gold-stamped gift box.\n• **Dragon Vein 30** — Kiln-transformation glazed bottle. Daqu Kunsha technique, vintage base spirit. Elegant, layered, full-bodied.\n• **Dragon Vein 15** — Brussels International Gold Award 2024. Special ceramic micro-oxygen bottle. Mellow and delicate with a long fragrant finish."
    },
    {
      keywords: ['limited', 'edition', 'mastercraft', 'supreme', 'gift', 'collector', 'rare'],
      response: "**The Limited &amp; Rare Series:**\n\n• **Limited Edition** — Gold-plated bottle with five-clawed dragon relief and sapphire-accented metal base. Collectible vintage Jiangxiang, limited release.\n• **Mastercraft Supreme** — Imperial yellow glaze, embossed dragon patterns, rose gold badge, and silk hand strap. Large-capacity gift specification — the finest choice for gifting distinguished guests."
    },
    {
      keywords: ['award', 'brussels', 'gold', 'prize', 'recognition', 'honour'],
      response: "LongGuoYan's international recognition includes:\n\n• **Brussels International Gold Award** — Dragon Vein 15 (2024)\n• **ISGC International Spirits Gold Award** — Dragon Vein 15 (2024)\n• **2024 International Tea Expo** — Tea &amp; Spirits Tasting Grand Prize\n• **5th Hainan Island International Film Festival** — Premier Cooperation Partner"
    },
    {
      keywords: ['partner', 'distribute', 'wholesale', 'cooperate', 'agent', 'business'],
      response: "We sincerely invite distribution partners to share in our brand's growth. LongGuoYan offers **territorial protection**, generous margins, and full-scale brand support. Call **400-159-1958** or visit our Partnerships page to apply."
    }
  ];

  function getOfflineResponse(text) {
    const input = text.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => input.includes(kw))) return item.response;
    }
    return "I don't have that information on hand right now. You can ask me about our **products** (like Cellar Supreme 30 or Mastercraft Supreme), our **heritage**, our **awards**, or how to **contact** us.";
  }

  function sendMessage() {
    if (!chatText || !chatMessages) return;
    const text = chatText.value.trim();
    if (!text) return;
    addMessage('user', text);
    chatText.value = '';

    const typingId = 'typing-' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.className = 'msg bot typing-indicator';
    typingMsg.id = typingId;
    typingMsg.innerHTML = '<span>Typing...</span>';
    chatMessages.appendChild(typingMsg);
    scrollToBottom();

    setTimeout(() => {
      document.getElementById(typingId)?.remove();
      const reply = getOfflineResponse(text);
      addMessage('bot', reply);
      if (text.toLowerCase().includes('product') || text.toLowerCase().includes('collection') || text.toLowerCase().includes('buy')) renderOptions();
    }, 600);
  }

  function renderOptions() {
    if (!chatMessages) return;
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'ag-chat-options';
    const options = [
      { label: 'Aged Collection', value: 'Tell me about the aged collection' },
      { label: 'Limited Edition', value: 'Tell me about Limited Edition' },
      { label: 'Mastercraft Supreme', value: 'Tell me about Mastercraft Supreme' },
      { label: 'Brand Heritage', value: 'Tell me about your heritage' }
    ];
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'ag-chat-opt-btn';
      btn.textContent = opt.label;
      btn.onclick = () => { chatText.value = opt.value; sendMessage(); };
      optionsDiv.appendChild(btn);
    });
    chatMessages.appendChild(optionsDiv);
    scrollToBottom();
  }

  let firstOpen = true;
  if (chatOpen && chat) {
    chatOpen.addEventListener('click', () => {
      chat.classList.remove('hidden');
      if (chatText) chatText.focus();
      if (firstOpen) {
        addMessage('bot', "Welcome to **LongGuoYan** — Brewed by Time, Honoring the Classics. How can I assist your discovery today?");
        renderOptions();
        firstOpen = false;
      }
    });
  }

  if (chatText) chatText.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });
  if (chatSend) chatSend.addEventListener('click', sendMessage);

  function addMessage(sender, text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    if (typeof marked !== 'undefined') { msg.innerHTML = marked.parse(text); } else { msg.textContent = text; }
    msg.querySelectorAll('a').forEach(link => { link.target = '_blank'; link.rel = 'noopener'; });
    chatMessages.appendChild(msg);
    scrollToBottom();
  }

  function scrollToBottom() {
    if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
