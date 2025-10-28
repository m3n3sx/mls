# Real-Time Collaboration Guide

## Overview

The MASE plugin now supports real-time collaboration, allowing multiple administrators to edit settings simultaneously without conflicts. This is achieved through WebSocket connections and Operational Transformation (OT) algorithms.

**Requirements**: 14.2

## Architecture

### Components

1. **WebSocket Connection** (API Client)
   - Maintains persistent connection to server
   - Automatic reconnection with exponential backoff
   - Heartbeat mechanism for connection health
   - Presence detection for active users

2. **Operational Transformation** (State Manager)
   - Conflict resolution for concurrent edits
   - Operation transformation algorithms
   - Pending operation queue
   - History tracking

3. **Collaboration Manager** (State Manager)
   - Coordinates WebSocket and OT engine
   - Manages presence data
   - Broadcasts local changes
   - Applies remote changes

## Usage

### Enabling Collaboration

```javascript
import { useStore, getCollaborationManager } from './modules/state-manager.js';
import apiClient from './modules/api-client.js';

// Get collaboration manager instance
const store = useStore.getState();
const collaborationManager = getCollaborationManager(useStore, apiClient);

// Enable collaborative editing
try {
  await collaborationManager.enable();
  console.log('Collaboration enabled');
} catch (error) {
  console.error('Failed to enable collaboration:', error);
}
```

### Disabling Collaboration

```javascript
// Disable collaborative editing
collaborationManager.disable();
console.log('Collaboration disabled');
```

### Checking Collaboration Status

```javascript
// Check if collaboration is enabled
const isEnabled = collaborationManager.isCollaborationEnabled();

// Get WebSocket connection state
const wsState = apiClient.getWebSocketState();
console.log('WebSocket state:', wsState);

// Get pending operations count
const pendingCount = collaborationManager.getPendingOperationsCount();
console.log('Pending operations:', pendingCount);
```

### Presence Management

```javascript
// Update your presence status
await collaborationManager.updatePresence({
  activity: 'editing',
  location: 'admin_bar',
  metadata: {
    tab: 'colors',
    section: 'background',
  },
});

// Get active collaborators
const collaborators = collaborationManager.getActiveCollaborators();
console.log('Active collaborators:', collaborators);
```

### Listening to Collaboration Events

```javascript
import eventBus, { EVENTS } from './modules/event-bus.js';

// Listen for collaboration enabled
eventBus.on(EVENTS.COLLABORATION_ENABLED, (data) => {
  console.log('Collaboration enabled at:', data.timestamp);
});

// Listen for remote changes
eventBus.on(EVENTS.COLLABORATION_REMOTE_CHANGE, (data) => {
  console.log('Remote change:', data.path, data.value);
  console.log('Changed by:', data.clientId);
});

// Listen for presence updates
eventBus.on(EVENTS.COLLABORATION_PRESENCE_UPDATE, (data) => {
  console.log('User presence update:', data.userId, data.presence);
});

// Listen for conflicts (rare with OT)
eventBus.on(EVENTS.COLLABORATION_CONFLICT, (data) => {
  console.warn('Collaboration conflict detected:', data);
});
```

## WebSocket API

### Connection Management

```javascript
// Connect to WebSocket
const ws = await apiClient.connectWebSocket({
  reconnectDelay: 1000,        // Initial reconnect delay (ms)
  maxReconnectDelay: 30000,    // Maximum reconnect delay (ms)
  reconnectAttempts: Infinity, // Maximum reconnect attempts
  heartbeatInterval: 30000,    // Heartbeat interval (ms)
});

// Check connection status
const isConnected = apiClient.isWebSocketConnected();

// Disconnect WebSocket
apiClient.disconnectWebSocket(1000, 'User logout');
```

### Message Subscriptions

```javascript
// Subscribe to specific message types
const unsubscribe = apiClient.subscribeToMessages('state-change', (data) => {
  console.log('State change received:', data);
});

// Subscribe to presence updates
const unsubPresence = apiClient.subscribeToPresence((data) => {
  console.log('Presence update:', data);
});

// Unsubscribe when done
unsubscribe();
unsubPresence();
```

### Broadcasting Changes

```javascript
// Broadcast state change to other clients
await apiClient.broadcastStateChange({
  path: 'admin_bar.bg_color',
  value: '#ff0000',
  oldValue: '#23282d',
  operation: 'set',
});

// Update presence
await apiClient.updatePresence({
  activity: 'active',
  location: '/wp-admin/admin.php?page=mase-settings',
  metadata: { editing: 'colors' },
});
```

## Operational Transformation

### Operation Types

```javascript
import { OperationType, Operation } from './modules/state-manager.js';

// Create operations
const setOp = new Operation(
  OperationType.SET,
  'admin_bar.bg_color',
  '#ff0000',
  '#23282d'
);

const deleteOp = new Operation(
  OperationType.DELETE,
  'custom_css',
  null,
  'body { color: red; }'
);

const insertOp = new Operation(
  OperationType.INSERT,
  'palettes.custom',
  { id: 'new-palette', name: 'My Palette' }
);
```

### Applying Operations

```javascript
// Apply operation to state
const currentState = useStore.getState();
const newState = setOp.apply(currentState.settings);

// Create inverse operation (for undo)
const inverseOp = setOp.inverse();
```

### Conflict Resolution

The OT engine automatically resolves conflicts between concurrent operations:

```javascript
import { OTEngine } from './modules/state-manager.js';

const otEngine = new OTEngine();

// Two concurrent operations
const op1 = new Operation(OperationType.SET, 'admin_bar.bg_color', '#ff0000');
const op2 = new Operation(OperationType.SET, 'admin_bar.bg_color', '#00ff00');

// Transform operations
const { op1Prime, op2Prime } = otEngine.transform(op1, op2);

// Apply transformed operations
// Last write wins based on timestamp
```

## Server-Side Requirements

### WebSocket Server

The server must implement a WebSocket endpoint at `/mase-ws` that:

1. Accepts connections with nonce authentication
2. Handles authentication messages
3. Broadcasts state changes to all connected clients
4. Manages presence updates
5. Sends heartbeat responses (pong)

### Message Format

```javascript
// Client to Server
{
  type: 'auth' | 'state-change' | 'presence-update' | 'ping',
  data: {
    // Message-specific data
  },
  nonce: 'wordpress-nonce',
  timestamp: 1234567890
}

// Server to Client
{
  type: 'pong' | 'state-change' | 'presence' | 'auth-success',
  data: {
    // Message-specific data
  },
  timestamp: 1234567890
}
```

### State Change Message

```javascript
{
  type: 'state-change',
  data: {
    path: 'admin_bar.bg_color',
    value: '#ff0000',
    oldValue: '#23282d',
    operation: 'set',
    clientId: 'user-123',
    timestamp: 1234567890
  }
}
```

### Presence Message

```javascript
{
  type: 'presence',
  data: {
    userId: '123',
    activity: 'editing',
    location: '/wp-admin/admin.php?page=mase-settings',
    metadata: { tab: 'colors' },
    timestamp: 1234567890
  }
}
```

## Best Practices

### 1. Enable Collaboration on Page Load

```javascript
// In main-admin.js initialization
async function initCollaboration() {
  const collaborationManager = getCollaborationManager(useStore, apiClient);
  
  try {
    await collaborationManager.enable();
  } catch (error) {
    console.warn('Collaboration not available:', error);
    // Continue without collaboration
  }
}
```

### 2. Handle Connection Loss Gracefully

```javascript
// Listen for disconnection
eventBus.on(EVENTS.COLLABORATION_DISABLED, () => {
  // Show notification to user
  showNotification('Collaboration disconnected. Changes will be saved locally.');
});

// Listen for reconnection
eventBus.on(EVENTS.COLLABORATION_ENABLED, () => {
  showNotification('Collaboration reconnected.');
});
```

### 3. Show Active Collaborators in UI

```javascript
// Update UI with active collaborators
function updateCollaboratorsList() {
  const collaborators = collaborationManager.getActiveCollaborators();
  
  const html = collaborators.map(user => `
    <div class="collaborator">
      <span class="avatar">${user.userId}</span>
      <span class="activity">${user.activity}</span>
      <span class="location">${user.location}</span>
    </div>
  `).join('');
  
  document.getElementById('collaborators-list').innerHTML = html;
}

// Update every 5 seconds
setInterval(updateCollaboratorsList, 5000);
```

### 4. Throttle Presence Updates

```javascript
// Throttle presence updates to avoid flooding
let presenceUpdateTimer = null;

function updatePresenceThrottled(status) {
  if (presenceUpdateTimer) {
    clearTimeout(presenceUpdateTimer);
  }
  
  presenceUpdateTimer = setTimeout(() => {
    collaborationManager.updatePresence(status);
  }, 1000); // Update at most once per second
}
```

### 5. Handle Conflicts Gracefully

```javascript
// Listen for conflicts
eventBus.on(EVENTS.COLLABORATION_CONFLICT, (data) => {
  // Show notification
  showNotification(
    `Conflict detected in ${data.path}. Your changes have been merged.`,
    'warning'
  );
  
  // Log for debugging
  console.warn('Collaboration conflict:', data);
});
```

## Troubleshooting

### WebSocket Connection Fails

1. Check server WebSocket endpoint is running
2. Verify nonce is valid
3. Check browser console for errors
4. Verify firewall allows WebSocket connections

### Changes Not Syncing

1. Check WebSocket connection status
2. Verify operations are being broadcast
3. Check for JavaScript errors in console
4. Verify server is broadcasting to all clients

### High Latency

1. Check network connection
2. Reduce heartbeat interval
3. Optimize operation size
4. Consider batching operations

### Memory Leaks

1. Ensure unsubscribe functions are called
2. Clear OT engine history periodically
3. Limit presence data retention
4. Monitor browser memory usage

## Performance Considerations

### Operation Queue

- Pending operations are queued and sent sequentially
- Maximum queue size should be monitored
- Consider batching operations for better performance

### Presence Updates

- Throttle presence updates to 1 per second
- Only send presence when activity changes
- Clean up stale presence data (>1 minute old)

### Memory Usage

- OT engine maintains operation history (max 100)
- Presence data is cleaned up automatically
- WebSocket messages are not persisted

### Network Usage

- Heartbeat every 30 seconds (~2KB/min)
- State changes vary by size (~1-10KB each)
- Presence updates (~500 bytes each)
- Total: ~5-20KB/min per active user

## Security Considerations

### Authentication

- All WebSocket connections require valid WordPress nonce
- Nonce is verified on server for each message
- Connections are automatically closed on invalid nonce

### Authorization

- Only users with `manage_options` capability can collaborate
- Server validates user permissions for each operation
- Sensitive operations require additional verification

### Data Validation

- All incoming operations are validated
- Malformed operations are rejected
- XSS prevention on all user-generated content

## Future Enhancements

### Planned Features

1. **Cursor Tracking**: Show where other users are editing
2. **Change Highlighting**: Highlight changes made by others
3. **Conflict Visualization**: Show conflicts in UI
4. **Undo/Redo Sync**: Synchronize undo/redo across clients
5. **Offline Support**: Queue operations when offline
6. **Compression**: Compress WebSocket messages
7. **Encryption**: End-to-end encryption for sensitive data

### API Extensions

1. **Operation Batching**: Batch multiple operations
2. **Selective Sync**: Sync only specific settings
3. **Conflict Callbacks**: Custom conflict resolution
4. **Presence Metadata**: Rich presence information
5. **User Cursors**: Track cursor positions

## Examples

### Complete Integration Example

```javascript
import { useStore, getCollaborationManager } from './modules/state-manager.js';
import apiClient from './modules/api-client.js';
import eventBus, { EVENTS } from './modules/event-bus.js';

class CollaborativeEditor {
  constructor() {
    this.store = useStore;
    this.collaborationManager = getCollaborationManager(useStore, apiClient);
    this.setupEventListeners();
  }

  async init() {
    try {
      // Enable collaboration
      await this.collaborationManager.enable();
      console.log('Collaboration enabled');
      
      // Update presence
      await this.updatePresence('active');
      
      // Start presence updates
      this.startPresenceUpdates();
      
      // Update UI
      this.updateCollaboratorsUI();
    } catch (error) {
      console.error('Failed to initialize collaboration:', error);
    }
  }

  setupEventListeners() {
    // Remote changes
    eventBus.on(EVENTS.COLLABORATION_REMOTE_CHANGE, (data) => {
      this.handleRemoteChange(data);
    });

    // Presence updates
    eventBus.on(EVENTS.COLLABORATION_PRESENCE_UPDATE, (data) => {
      this.handlePresenceUpdate(data);
    });

    // Connection status
    eventBus.on(EVENTS.COLLABORATION_ENABLED, () => {
      this.showNotification('Connected to collaboration server');
    });

    eventBus.on(EVENTS.COLLABORATION_DISABLED, () => {
      this.showNotification('Disconnected from collaboration server');
    });
  }

  handleRemoteChange(data) {
    // Show notification
    this.showNotification(
      `${data.clientId} changed ${data.path}`,
      'info'
    );

    // Highlight changed element
    this.highlightElement(data.path);
  }

  handlePresenceUpdate(data) {
    // Update collaborators list
    this.updateCollaboratorsUI();
  }

  async updatePresence(activity) {
    await this.collaborationManager.updatePresence({
      activity,
      location: window.location.pathname,
      metadata: {
        tab: this.store.getState().ui.activeTab,
      },
    });
  }

  startPresenceUpdates() {
    // Update presence every 30 seconds
    setInterval(() => {
      this.updatePresence('active');
    }, 30000);
  }

  updateCollaboratorsUI() {
    const collaborators = this.collaborationManager.getActiveCollaborators();
    // Update UI with collaborators list
    console.log('Active collaborators:', collaborators);
  }

  highlightElement(path) {
    // Highlight the changed element in UI
    const element = document.querySelector(`[data-setting="${path}"]`);
    if (element) {
      element.classList.add('remote-change');
      setTimeout(() => {
        element.classList.remove('remote-change');
      }, 2000);
    }
  }

  showNotification(message, type = 'info') {
    console.log(`[${type}] ${message}`);
    // Show notification in UI
  }

  destroy() {
    // Disable collaboration
    this.collaborationManager.disable();
  }
}

// Initialize
const editor = new CollaborativeEditor();
editor.init();
```

## Conclusion

The real-time collaboration feature provides a robust foundation for multi-user editing with automatic conflict resolution. The WebSocket connection ensures low-latency updates, while the Operational Transformation engine guarantees consistency across all clients.

For questions or issues, please refer to the troubleshooting section or contact the development team.
