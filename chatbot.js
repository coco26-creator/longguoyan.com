document.addEventListener('DOMContentLoaded', () => {
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

  async function sendMessage() {
    if (!chatText || !chatMessages) return;
    const text = chatText.value.trim();
    if (!text) return;
    
    // Add user message
    addMessage('user', text);
    chatText.value = '';
    
    // Add typing indicator
    const typingId = 'typing-' + Date.now();
    const typingMsg = document.createElement('div');
    typingMsg.className = 'msg bot typing-indicator';
    typingMsg.id = typingId;
    typingMsg.innerHTML = '<span style="font-size:18px; line-height:0;">💬 Thinking...</span>';
    chatMessages.appendChild(typingMsg);
    scrollToBottom();

    try {
      // Connect to the Backend Proxy
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      
      // Remove typing indicator
      document.getElementById(typingId)?.remove();

      if (data.reply) {
        addMessage('bot', data.reply);
      } else {
        addMessage('bot', data.error || "An error occurred.");
      }
    } catch (e) {
      document.getElementById(typingId)?.remove();
      addMessage('bot', "Connection error. Make sure the Node.js backend server (`server.js`) is currently running on port 3000!");
    }
  }

  if (chatSend) {
    chatSend.addEventListener('click', sendMessage);
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
});
