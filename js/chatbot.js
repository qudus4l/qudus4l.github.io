/**
 * Chatbot functionality for portfolio QA bot
 */

class PortfolioChat {
    constructor() {
        this.apiUrl = 'https://mydevapp.loca.lt';
        this.chatHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        
        this.initChatUI();
        this.bindEvents();
        this.startPulsatingAnimation();
    }
    
    initChatUI() {
        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chat-container';
        chatContainer.innerHTML = `
            <div class="chat-button">
                <i class="fas fa-robot"></i>
                <span class="chat-tooltip">Ask me about Qudus!</span>
            </div>
            <div class="chat-box">
                <div class="chat-header">
                    <h3>Ask me anything about Qudus</h3>
                    <button class="close-chat">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="chat-messages">
                    <div class="bot-message">
                        <div class="message-content">
                            Hi there! I'm Qudus's AI assistant. Ask me anything about his skills, experience, or projects.
                        </div>
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" placeholder="Type your question..." />
                    <button class="send-button">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatContainer);
        
        // Store references to DOM elements
        this.chatButton = document.querySelector('.chat-button');
        this.chatBox = document.querySelector('.chat-box');
        this.closeButton = document.querySelector('.close-chat');
        this.messagesContainer = document.querySelector('.chat-messages');
        this.chatInput = document.querySelector('.chat-input');
        this.sendButton = document.querySelector('.send-button');
        this.chatTooltip = document.querySelector('.chat-tooltip');
    }
    
    bindEvents() {
        // Toggle chat box
        this.chatButton.addEventListener('click', () => this.toggleChat());
        this.closeButton.addEventListener('click', () => this.toggleChat());
        
        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Send message on Enter key
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Add event listener for contact section chat button
        document.addEventListener('DOMContentLoaded', () => {
            const contactChatButton = document.getElementById('contact-chat-button');
            if (contactChatButton) {
                contactChatButton.addEventListener('click', () => {
                    this.toggleChat(true);
                });
            }
        });
    }
    
    toggleChat(forceOpen = false) {
        if (forceOpen) {
            this.isOpen = true;
        } else {
            this.isOpen = !this.isOpen;
        }
        
        if (this.isOpen) {
            this.chatBox.classList.add('open');
            this.chatInput.focus();
            this.chatButton.classList.remove('pulsate');
            this.chatButton.classList.remove('bounce');
            this.chatTooltip.style.display = 'none';
        } else {
            this.chatBox.classList.remove('open');
            setTimeout(() => {
                this.startPulsatingAnimation();
            }, 3000);
        }
    }
    
    startPulsatingAnimation() {
        if (!this.isOpen) {
            // Start with pulsate animation
            this.chatButton.classList.add('pulsate');
            this.chatTooltip.style.display = 'block';
            
            // Occasionally bounce to draw attention
            setInterval(() => {
                if (!this.isOpen) {
                    this.chatButton.classList.remove('pulsate');
                    this.chatButton.classList.add('bounce');
                    
                    setTimeout(() => {
                        if (!this.isOpen) {
                            this.chatButton.classList.remove('bounce');
                            this.chatButton.classList.add('pulsate');
                        }
                    }, 1000);
                }
            }, 15000);
        }
    }
    
    async sendMessage() {
        const query = this.chatInput.value.trim();
        
        if (!query || this.isLoading) return;
        
        // Add user message to chat
        this.addMessage(query, 'user');
        this.chatInput.value = '';
        
        // Show loading indicator
        this.isLoading = true;
        this.addLoadingIndicator();
        
        try {
            const response = await this.queryBot(query);
            
            // Remove loading indicator
            this.removeLoadingIndicator();
            
            // Add bot response to chat
            if (response.answer) {
                this.addMessage(response.answer, 'bot');
            } else if (response.error) {
                this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
                console.error(response.error);
            }
        } catch (error) {
            // Remove loading indicator
            this.removeLoadingIndicator();
            
            // Add error message
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
            console.error('Error querying bot:', error);
        }
        
        this.isLoading = false;
    }
    
    async queryBot(query) {
        const response = await fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        messageDiv.innerHTML = `
            <div class="message-content">${content}</div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom of chat
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        
        // Add to chat history
        this.chatHistory.push({ sender, content });
    }
    
    addLoadingIndicator() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'bot-message loading';
        loadingDiv.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(loadingDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    removeLoadingIndicator() {
        const loadingIndicator = document.querySelector('.loading');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit to ensure other scripts are loaded
    setTimeout(() => {
        new PortfolioChat();
    }, 1000);
}); 