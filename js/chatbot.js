/**
 * Chatbot functionality for portfolio QA bot
 */

class PortfolioChat {
    constructor() {
        this.apiUrl = 'https://portfolio-chat-14rh.onrender.com/api/chat';
        this.chatHistory = [];
        this.isOpen = false;
        this.isLoading = false;
        this.coldStartTimer = null;
        this.requestTimeout = null;
        
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
                <div class="bot-orb">
                    <div class="bot-core"></div>
                    <div class="bot-ring"></div>
                    <div class="bot-scanner"></div>
                </div>
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
        const contactChatButton = document.getElementById('contact-chat-button');
        if (contactChatButton) {
            contactChatButton.addEventListener('click', () => {
                this.toggleChat(true);
            });
        } else {
            // In case script loads before the contact section, observe DOM mutations once
            const observer = new MutationObserver((mutations, obs) => {
                const button = document.getElementById('contact-chat-button');
                if (button) {
                    button.addEventListener('click', () => this.toggleChat(true));
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
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
        
        // Set up cold start warning timer
        this.coldStartTimer = setTimeout(() => {
            this.showColdStartMessage();
        }, 8000); // Show after 8 seconds
        
        // Set up request timeout
        this.requestTimeout = setTimeout(() => {
            this.handleTimeout();
        }, 45000); // Timeout after 45 seconds
        
        try {
            const response = await this.queryBot(query);
            
            // Clear timers
            this.clearTimers();
            
            // Remove loading indicator
            this.removeLoadingIndicator();
            
            // Add bot response to chat
            if (response.answer) {
                this.addMessage(response.answer, 'bot');
            } else if (response.error) {
                this.addMessage('I apologize, but I encountered an issue processing your request. Please try again in a moment.', 'bot');
                console.error(response.error);
            }
        } catch (error) {
            // Clear timers
            this.clearTimers();
            
            // Remove loading indicator
            this.removeLoadingIndicator();
            
            // Add error message based on error type
            if (error.name === 'TimeoutError') {
                this.addMessage('The service is taking longer than expected to respond. This might be due to server maintenance. Please try again in a few moments.', 'bot');
            } else {
                this.addMessage('I apologize, but I encountered a technical issue. Please try again in a moment.', 'bot');
            }
            console.error('Error querying bot:', error);
        }
        
        this.isLoading = false;
    }
    
    async queryBot(query) {
        // Create an AbortController for request timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 40000); // 40 second timeout
        
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query }),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                const timeoutError = new Error('Request timed out');
                timeoutError.name = 'TimeoutError';
                throw timeoutError;
            }
            throw error;
        }
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
        
        // Also remove cold start message if present
        const coldStartMessage = document.querySelector('.cold-start-message');
        if (coldStartMessage) {
            coldStartMessage.remove();
        }
    }
    
    showColdStartMessage() {
        // Remove existing cold start message if any
        const existing = document.querySelector('.cold-start-message');
        if (existing) existing.remove();
        
        const coldStartDiv = document.createElement('div');
        coldStartDiv.className = 'bot-message cold-start-message';
        coldStartDiv.innerHTML = `
            <div class="message-content cold-start-content">
                <div class="cold-start-icon">
                    <i class="fas fa-coffee"></i>
                </div>
                <div class="cold-start-text">
                    <strong>Just a moment...</strong><br>
                    <span>The AI service is warming up. This may take up to 30 seconds on the first request due to server optimization.</span>
                </div>
            </div>
        `;
        
        this.messagesContainer.appendChild(coldStartDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    handleTimeout() {
        this.clearTimers();
        this.removeLoadingIndicator();
        
        const timeoutMessage = `I apologize for the delay. The service appears to be experiencing high load or is in sleep mode. 
        
This can happen with free hosting services during periods of inactivity. Please try again in a few moments, and the response should be much faster.`;
        
        this.addMessage(timeoutMessage, 'bot');
        this.isLoading = false;
    }
    
    clearTimers() {
        if (this.coldStartTimer) {
            clearTimeout(this.coldStartTimer);
            this.coldStartTimer = null;
        }
        if (this.requestTimeout) {
            clearTimeout(this.requestTimeout);
            this.requestTimeout = null;
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