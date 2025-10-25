/**
 * Event Bus Module Tests
 * 
 * Tests for pub/sub pattern, error isolation, and performance optimizations.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { EventBus, EVENTS } from '@modules/event-bus.js';

describe('EventBus', () => {
  let eventBus;

  beforeEach(() => {
    eventBus = new EventBus({ isDevelopment: false });
  });

  afterEach(() => {
    eventBus.clear();
  });

  describe('Basic pub/sub functionality', () => {
    it('should subscribe and emit events', () => {
      const handler = vi.fn();
      eventBus.on('test:event', handler);
      
      eventBus.emit('test:event', { data: 'test' });
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith({ data: 'test' }, 'test:event');
    });

    it('should support multiple subscribers to same event', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.on('test:event', handler1);
      eventBus.on('test:event', handler2);
      
      eventBus.emit('test:event', { data: 'test' });
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should return unsubscribe function from on()', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.on('test:event', handler);
      
      eventBus.emit('test:event');
      expect(handler).toHaveBeenCalledTimes(1);
      
      unsubscribe();
      eventBus.emit('test:event');
      expect(handler).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should throw error for invalid event name', () => {
      expect(() => eventBus.on('', vi.fn())).toThrow('Event name must be a non-empty string');
      expect(() => eventBus.on(null, vi.fn())).toThrow('Event name must be a non-empty string');
    });

    it('should throw error for invalid handler', () => {
      expect(() => eventBus.on('test:event', null)).toThrow('Handler must be a function');
      expect(() => eventBus.on('test:event', 'not a function')).toThrow('Handler must be a function');
    });
  });

  describe('once() functionality', () => {
    it('should subscribe and auto-unsubscribe after first emission', () => {
      const handler = vi.fn();
      eventBus.once('test:event', handler);
      
      eventBus.emit('test:event', { data: 'first' });
      expect(handler).toHaveBeenCalledTimes(1);
      
      eventBus.emit('test:event', { data: 'second' });
      expect(handler).toHaveBeenCalledTimes(1); // Not called again
    });

    it('should return unsubscribe function from once()', () => {
      const handler = vi.fn();
      const unsubscribe = eventBus.once('test:event', handler);
      
      unsubscribe();
      eventBus.emit('test:event');
      
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('off() functionality', () => {
    it('should unsubscribe specific handler', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.on('test:event', handler1);
      eventBus.on('test:event', handler2);
      
      eventBus.off('test:event', handler1);
      eventBus.emit('test:event');
      
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe all handlers when no handler specified', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.on('test:event', handler1);
      eventBus.on('test:event', handler2);
      
      eventBus.off('test:event');
      eventBus.emit('test:event');
      
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('Event namespacing', () => {
    it('should support namespaced events', () => {
      const handler = vi.fn();
      eventBus.on('settings:color:changed', handler);
      
      eventBus.emit('settings:color:changed', { color: 'red' });
      
      expect(handler).toHaveBeenCalledWith({ color: 'red' }, 'settings:color:changed');
    });

    it('should not trigger handlers for different namespaces', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.on('settings:color', handler1);
      eventBus.on('settings:typography', handler2);
      
      eventBus.emit('settings:color');
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('Wildcard subscriptions', () => {
    it('should support wildcard subscriptions', () => {
      const handler = vi.fn();
      eventBus.on('settings:*', handler);
      
      eventBus.emit('settings:color');
      eventBus.emit('settings:typography');
      
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should support nested wildcard subscriptions', () => {
      const handler = vi.fn();
      eventBus.on('settings:*:changed', handler);
      
      eventBus.emit('settings:color:changed');
      eventBus.emit('settings:typography:changed');
      
      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should not match wildcards incorrectly', () => {
      const handler = vi.fn();
      eventBus.on('settings:*', handler);
      
      eventBus.emit('preview:update');
      
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('Error isolation', () => {
    it('should continue delivery to other subscribers when handler fails', () => {
      const handler1 = vi.fn(() => {
        throw new Error('Handler 1 failed');
      });
      const handler2 = vi.fn();
      const handler3 = vi.fn();
      
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      eventBus.on('test:event', handler1);
      eventBus.on('test:event', handler2);
      eventBus.on('test:event', handler3);
      
      eventBus.emit('test:event');
      
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);
      expect(handler3).toHaveBeenCalledTimes(1);
      expect(consoleError).toHaveBeenCalled();
      
      consoleError.mockRestore();
    });

    it('should emit error event when handler fails', () => {
      const errorHandler = vi.fn();
      const failingHandler = vi.fn(() => {
        throw new Error('Test error');
      });
      
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      eventBus.on(EVENTS.ERROR_OCCURRED, errorHandler);
      eventBus.on('test:event', failingHandler);
      
      eventBus.emit('test:event');
      
      expect(errorHandler).toHaveBeenCalledTimes(1);
      expect(errorHandler.mock.calls[0][0]).toMatchObject({
        event: 'test:event',
        listenerEvent: 'test:event',
      });
      
      consoleError.mockRestore();
    });
  });

  describe('Performance optimizations', () => {
    it('should deliver events within 5ms for small subscriber count', () => {
      const handlers = Array.from({ length: 10 }, () => vi.fn());
      handlers.forEach(handler => eventBus.on('test:event', handler));
      
      const start = performance.now();
      eventBus.emit('test:event');
      const duration = performance.now() - start;
      
      expect(duration).toBeLessThan(5);
      handlers.forEach(handler => expect(handler).toHaveBeenCalledTimes(1));
    });

    it('should queue events with emitQueued()', () => {
      const handler = vi.fn();
      eventBus.on('test:event', handler);
      
      eventBus.emitQueued('test:event', { data: 1 });
      eventBus.emitQueued('test:event', { data: 2 });
      eventBus.emitQueued('test:event', { data: 3 });
      
      // Events are queued, not immediately delivered
      expect(handler).not.toHaveBeenCalled();
      
      // Wait for queue processing
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            expect(handler).toHaveBeenCalledTimes(3);
            resolve();
          });
        });
      });
    });

    it('should debounce rapid events with emitDebounced()', () => {
      const handler = vi.fn();
      eventBus.on('test:event', handler);
      
      eventBus.emitDebounced('test:event', { data: 1 }, 50);
      eventBus.emitDebounced('test:event', { data: 2 }, 50);
      eventBus.emitDebounced('test:event', { data: 3 }, 50);
      
      // Should not be called immediately
      expect(handler).not.toHaveBeenCalled();
      
      // Wait for debounce delay
      return new Promise(resolve => {
        setTimeout(() => {
          expect(handler).toHaveBeenCalledTimes(1);
          expect(handler).toHaveBeenCalledWith({ data: 3 }, 'test:event');
          resolve();
        }, 100);
      });
    });
  });

  describe('Utility methods', () => {
    it('should return listener count', () => {
      eventBus.on('test:event', vi.fn());
      eventBus.on('test:event', vi.fn());
      eventBus.once('test:event', vi.fn());
      
      expect(eventBus.getListenerCount('test:event')).toBe(3);
    });

    it('should return all registered events', () => {
      eventBus.on('event1', vi.fn());
      eventBus.on('event2', vi.fn());
      eventBus.once('event3', vi.fn());
      
      const events = eventBus.getEvents();
      expect(events).toContain('event1');
      expect(events).toContain('event2');
      expect(events).toContain('event3');
      expect(events.length).toBe(3);
    });

    it('should clear all listeners', () => {
      const handler1 = vi.fn();
      const handler2 = vi.fn();
      
      eventBus.on('event1', handler1);
      eventBus.on('event2', handler2);
      
      eventBus.clear();
      
      eventBus.emit('event1');
      eventBus.emit('event2');
      
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
      expect(eventBus.getEvents().length).toBe(0);
    });
  });

  describe('EVENTS constants', () => {
    it('should export predefined event types', () => {
      expect(EVENTS.SETTINGS_CHANGED).toBe('settings:changed');
      expect(EVENTS.PREVIEW_UPDATE).toBe('preview:update');
      expect(EVENTS.COLOR_SELECTED).toBe('color:selected');
      expect(EVENTS.TEMPLATE_APPLIED).toBe('template:applied');
      expect(EVENTS.SAVE_STARTED).toBe('save:started');
      expect(EVENTS.SAVE_COMPLETED).toBe('save:completed');
      expect(EVENTS.ERROR_OCCURRED).toBe('error:occurred');
    });
  });
});
