document.addEventListener('DOMContentLoaded', () => {
  // Inject the HTML structure into the body
  const chatbotHTML = `
    <div id="ag-chatbot-container">
      <button id="ag-chatbot-toggle" aria-label="Open chat">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      <div id="ag-chatbot-window" class="hidden">
        <div class="ag-chatbot-header">
          <div class="header-info">
            <span class="bot-avatar">🤖</span>
            <div class="bot-details">
              <h4>Longguoyan Assistant</h4>
              <p>Online</p>
            </div>
          </div>
          <button id="ag-chatbot-close" aria-label="Close chat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <div id="ag-chatbot-messages">
          <div class="message bot">
            Hello! Welcome to Longguoyan. How can we help you today?
          </div>
        </div>

        <div class="ag-chatbot-input-area">
          <input type="text" id="ag-chatbot-input" placeholder="Type a message..." aria-label="Chat input">
          <button id="ag-chatbot-send" aria-label="Send message">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  // Append safely to body
  document.body.insertAdjacentHTML('beforeend', chatbotHTML);

  // Grab elements
  const toggleBtn = document.getElementById('ag-chatbot-toggle');
  const closeBtn = document.getElementById('ag-chatbot-close');
  const chatWindow = document.getElementById('ag-chatbot-window');
  const inputField = document.getElementById('ag-chatbot-input');
  const sendBtn = document.getElementById('ag-chatbot-send');
  const messagesContainer = document.getElementById('ag-chatbot-messages');

  // Toggle Logic
  const toggleChat = () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      inputField.focus();
      // Add small notification dot logic later if needed
    }
  };

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Chat Logic
  const addMessage = (text, sender) => {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message', sender);
    msgElement.textContent = text;
    messagesContainer.appendChild(msgElement);
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  };

  const handleSend = () => {
    const text = inputField.value.trim();
    if (!text) return;

    // Add user message
    addMessage(text, 'user');
    inputField.value = '';

    // Show typing status
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot', 'typing');
    typingIndicator.innerHTML = '<span>.</span><span>.</span><span>.</span>';
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Simulate bot response after 1s
    setTimeout(() => {
      typingIndicator.remove();
      const mockResponses = [
        "That's interesting! Please tell me more.",
        "Our baijiu is distinguished by its unique heritage and brewing process.",
        "If you'd like to reach out, please visit our contact page.",
        "Thank you for your interest in Longguoyan!"
      ];
      const reply = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      addMessage(reply, 'bot');
    }, 1000);
  };

  // Event Listeners for sending
  sendBtn.addEventListener('click', handleSend);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
});
