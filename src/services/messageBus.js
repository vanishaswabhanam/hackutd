// Simple Event Bus for Inter-Agent Communication

class MessageBus {
  constructor() {
    this.listeners = {};
    this.messages = [];
    this.maxMessages = 100; // Keep last 100 messages
  }

  /**
   * Subscribe to messages
   * @param {string} event - Event name to listen for
   * @param {function} callback - Function to call when event fires
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Emit a message to all listeners
   * @param {string} event - Event name
   * @param {object} data - Message data
   */
  emit(event, data) {
    const message = {
      id: Date.now() + Math.random(),
      event,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Store message
    this.messages.push(message);
    if (this.messages.length > this.maxMessages) {
      this.messages.shift();
    }

    // Persist to localStorage for UI access
    this.saveToStorage();

    // Notify listeners
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in message bus listener:', error);
        }
      });
    }
  }

  /**
   * Get all messages, optionally filtered
   * @param {string} vendorId - Optional vendor ID to filter by
   * @returns {Array} - Array of messages
   */
  getMessages(vendorId = null) {
    if (vendorId) {
      return this.messages.filter(m => m.vendorId === vendorId);
    }
    return [...this.messages];
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    this.saveToStorage();
  }

  /**
   * Save messages to localStorage for persistence
   */
  saveToStorage() {
    try {
      localStorage.setItem('agentMessages', JSON.stringify(this.messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  }

  /**
   * Load messages from localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('agentMessages');
      if (stored) {
        this.messages = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }

  /**
   * Helper to log agent-to-agent communication
   * @param {string} from - Source agent name
   * @param {string} to - Target agent name
   * @param {string} message - Communication message
   * @param {string} priority - Priority level (low/medium/high)
   * @param {string} vendorId - Associated vendor ID
   */
  agentMessage(from, to, message, priority = 'medium', vendorId = null) {
    this.emit('agent-communication', {
      from,
      to,
      message,
      priority,
      vendorId,
      type: 'communication'
    });
  }

  /**
   * Helper to log agent activity
   * @param {string} agent - Agent name
   * @param {string} action - Action description
   * @param {string} vendorId - Associated vendor ID
   * @param {object} metadata - Additional metadata
   */
  agentActivity(agent, action, vendorId = null, metadata = {}) {
    this.emit('agent-activity', {
      agent,
      action,
      vendorId,
      type: 'activity',
      ...metadata
    });
  }

  /**
   * Helper to log agent findings
   * @param {string} agent - Agent name
   * @param {string} finding - Finding description
   * @param {string} severity - Severity level (info/warning/critical)
   * @param {string} vendorId - Associated vendor ID
   */
  agentFinding(agent, finding, severity = 'info', vendorId = null) {
    this.emit('agent-finding', {
      agent,
      finding,
      severity,
      vendorId,
      type: 'finding'
    });
  }
}

// Export singleton instance
const messageBus = new MessageBus();

// Load existing messages on init
messageBus.loadFromStorage();

export default messageBus;

