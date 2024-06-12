/**
 * Class representing an EventEmitter.
 */
class EventEmitter {
  #handlers;
  /**
   * Create an EventEmitter.
   */
  constructor() {
    /** @private @type {Map<string, Set<Function>>} */
    this.#handlers = new Map();
  }

  /**
   * Register a listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} cb - The callback function to be called when the event is emitted.
   */
  on(eventName, cb) {
    // Checking whether event already exists in the handlers
    const handlers = this.#handlers.get(eventName);
    if (!handlers) {
      this.#handlers.set(eventName, new Set());
      this.#handlers.get(eventName).add(cb);
      return;
    }
    handlers.add(cb);
  }

  /**
   * Register a one-time listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} cb - The callback function to be called once when the event is emitted.
   */
  once(eventName, cb) {
    const wrapper = (...args) => {
      cb(...args);
      this.removeListener(eventName, wrapper);
    };

    this.on(eventName, wrapper);
  }

  /**
   * Emit an event with the given name and data.
   * @param {string} eventName - The name of the event to emit.
   * @param {*} data - The data to be passed to the event listeners.
   */
  emit(eventName, data) {
    const handlers = this.#handlers.get(eventName);
    for (const handler of handlers) {
      try {
        handler(null, data);
      } catch (error) {
        handler(error, null);
      }
    }
  }

  /**
   * Remove all listeners for the specified event.
   * @param {string} eventName - The name of the event.
   */
  removeEvent(eventName) {
    this.#handlers.delete(eventName);
  }

  /**
   * Remove a specific listener for the specified event.
   * @param {string} eventName - The name of the event.
   * @param {Function} cb - The callback function to be removed.
   */
  removeListener(eventName, cb) {
    const listeners = this.#handlers.get(eventName);
    listeners.delete(cb);
  }

  /**
   * Get all listeners for the specified event.
   * @param {string} eventName - The name of the event.
   * @returns {Set<Function>} - A set containing all listeners for the event.
   */
  listeners(eventName) {
    const events = this.#handlers.get(eventName);
    return new Set(events);
  }

  /**
   * Get an array of all event names.
   * @returns {string[]} - An array containing all event names.
   */
  names() {
    return [...this.#handlers.keys()];
  }
}

module.exports = EventEmitter;
