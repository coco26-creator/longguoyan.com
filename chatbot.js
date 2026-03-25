function initChatbot() {
  // Inject marked.js for Markdown parsing
  const markedScript = document.createElement('script');
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
  markedScript.defer = true;
  document.head.appendChild(markedScript);

  // Inject the new HTML structure into the body
  const chatbotHTML = `
    <!-- ===================== CHATBOT ===================== -->
    <button id="chat-open" class="ag-chat-open">
      💬
    </button>

    <div id="chat" class="ag-chat-window hidden">
      <div class="ag-chat-header">
        <span class="ag-chat-title">Longguoyan Assistant</span>
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

  // Initialize Chatbot Logic once marked is loaded (or fallback)
  const chatOpen = document.getElementById('chat-open');
  const chatClose = document.getElementById('chat-close');
  const chat = document.getElementById('chat');
  const chatMessages = document.getElementById('chat-messages');
  const chatText = document.getElementById('chat-text');
  const chatSend = document.getElementById('chat-send');

  if (chatOpen && chat) {
    chatOpen.addEventListener('click', () => {
      chat.classList.remove('hidden');
      if (chatText) chatText.focus();
    });
  }

  if (chatClose && chat) {
    chatClose.addEventListener('click', () => {
      chat.classList.add('hidden');
    });
  }

  const knowledgeBase = [
    {
      keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'evening'],
      response: "Hello! I am the **LongGuoYan Assistant**. How can I help you discover our premium baijiu today?"
    },
    {
      keywords: ['product', 'collection', 'series', 'liquor', 'bottles', 'buy'],
      response: "Our premium collection includes:<br><br>• **Cellar Supreme 30**<br>• **Dragon Vein Series**<br>• **Limited Editions**<br>• **Commemorative 1958**<br>• **Collector's Reserve**<br><br>Which one would you like to know more about?"
    },
    {
      keywords: ['contact', 'phone', 'call', 'number', 'reach', 'support'],
      response: "You can reach our customer service team at **400-159-1958**."
    },
    {
      keywords: ['location', 'where', 'address', 'place', 'village', 'visit', 'guizhou'],
      response: "Our distillery is located at **Chun Shu Village, Maotai Town, Renhuai, Guizhou, China**."
    },
    {
      keywords: ['heritage', 'history', 'story', 'making', 'crafting', 'traditional', 'brew', 'distill', 'maotai', 'village'],
      response: "LongGuoYan is born from the sacred lands of **Maotai Town, Guizhou**. We inherit century-old traditional techniques: using premium red-glutinous sorghum, organic wheat, and the pristine waters of the Chishui River. Our 'Solid-State Fermentation' process captures the authentic soul of Jiangxiang baijiu."
    },
    {
      keywords: ['aged', 'years', 'vintages', 'cellar', 'supreme', '30'],
      response: "**The Aged Collection** represents our highest mastery. \n\n• **Cellar Supreme 30**: Aged 30 years in ceramic jars for unparalleled mellowness.\n• **Dragon Vein 15**: A 15-year aged spirit with a bold, complex profile.\n• **Sealed Reserve**: Available in 10 and 15-year vintages."
    },
    {
      keywords: ['limited', 'edition', 'collector', 'rare', 'treasure'],
      response: "**The Limited & Rare Series** is crafted for connoisseurs. \n\n• **Limited Edition**: Features dragon relief embossing and imperial gold finish.\n• **Collector's Reserve**: A prestigious blend for serious collectors.\n• **Treasure Edition**: Time-aged premium sorghum spirit."
    },
    {
      keywords: ['gift', 'business', 'diplomatic', 'commemorative', 'blessing'],
      response: "**The Gifting & Occasion Series** is designed for meaningful connections. \n\n• **Diplomatic Edition**: Premium gifting for business and international respect.\n• **Heaven's Blessing (1.5L/500ml)**: Perfect for auspicious celebrations.\n• **Commemorative 1958**: Honouring our founding year with classic elegance."
    }
  ];

  function getOfflineResponse(text) {
    const input = text.toLowerCase();
    for (const item of knowledgeBase) {
      if (item.keywords.some(kw => input.includes(kw))) {
        return item.response;
      }
    }
    return "I am still learning about that! You can ask me about our **products** (like Cellar Supreme 30), our **history**, or how to **contact** us.";
  }

  function sendMessage() {
    if (!chatText || !chatMessages) return;
    const text = chatText.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage('user', text);
    chatText.value = '';
    
    // Add slight delay for "Thinking" feel
    const typingId = 'typing-' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.className = 'msg bot typing-indicator';
    typingMsg.id = typingId;
    typingMsg.innerHTML = '<span>💬 Thinking...</span>';
    chatMessages.appendChild(typingMsg);
    scrollToBottom();

    setTimeout(() => {
      document.getElementById(typingId)?.remove();
      const reply = getOfflineResponse(text);
      addMessage('bot', reply);
      
      // If the user seems to be looking for products, show the navigator
      if (text.toLowerCase().includes('product') || text.toLowerCase().includes('collection') || text.toLowerCase().includes('buy')) {
        renderOptions();
      }
    }, 600);
  }

  function renderOptions() {
    if (!chatMessages) return;
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'ag-chat-options';
    const options = [
      { label: '🍷 Aged Series', value: 'Tell me about the Aged Series' },
      { label: '💎 Limited Editions', value: 'Tell me about Limited Editions' },
      { label: '🎁 Gifting Collection', value: 'Tell me about Gifting' },
      { label: '📜 Brand Heritage', value: 'Tell me about your heritage' }
    ];
    
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'ag-chat-opt-btn';
      btn.textContent = opt.label;
      btn.onclick = () => {
        chatText.value = opt.value;
        sendMessage();
      };
      optionsDiv.appendChild(btn);
    });
    chatMessages.appendChild(optionsDiv);
    scrollToBottom();
  }

  // Show welcome message and options on first open
  let firstOpen = true;
  if (chatOpen && chat) {
    chatOpen.addEventListener('click', () => {
      chat.classList.remove('hidden');
      if (chatText) chatText.focus();
      
      if (firstOpen) {
        addMessage('bot', "Welcome to **LongGuoYan**. I am your collection navigator. How can I assist your discovery today?");
        renderOptions();
        firstOpen = false;
      }
    });
  }

  if (chatText) {
    chatText.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  function addMessage(sender, text) {
    if (!chatMessages) return;
    const msg = document.createElement('div');
    msg.className = `msg ${sender}`;
    
    // Fallback if marked is still loading
    if (typeof marked !== 'undefined') {
      msg.innerHTML = marked.parse(text);
    } else {
      msg.textContent = text;
    }
    
    msg.querySelectorAll('a').forEach(link => {
      link.target = '_blank';
      link.rel = 'noopener';
      link.href = link.href.trim();
    });
    chatMessages.appendChild(msg);
    scrollToBottom();
  }

  function scrollToBottom() {
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initChatbot);
} else {
  initChatbot();
}
