# Spec: Content Visibility and Error Handling

**Change ID**: `refine-dialogue-system-visual-ux`
**Capability**: Content Visibility and Error Handling
**Status**: Proposed

---

## Overview

Fix empty dialogue panels by implementing robust error handling, loading states, and defensive null checks to ensure all dialogue threads render correctly.

**User Report**:
> "其余板块是空的，没有显示（从前端看）"
> (Other panels are empty, not showing from the frontend)

---

## Requirements

### ADDED

#### REQ-VIS-001: Defensive Null Checks in Render
**Priority**: P0

The dialogue player render logic SHALL include defensive null checks to prevent crashes when data is missing or malformed.

**Specification**:
- Check `thread` exists before accessing properties
- Check `thread.messages` exists and is non-empty
- Check `thread.participants` exists
- Early return or throw descriptive error if validation fails

**Validation**:
```javascript
// In DialoguePlayer._render()
_render() {
  try {
    // Defensive checks
    if (!this.thread) {
      throw new Error('[DialoguePlayer] No dialogue thread data provided');
    }

    if (!this.thread.messages || !Array.isArray(this.thread.messages)) {
      throw new Error('[DialoguePlayer] Thread.messages is missing or invalid');
    }

    if (this.thread.messages.length === 0) {
      throw new Error('[DialoguePlayer] Thread has no messages');
    }

    if (!this.thread.participants || this.thread.participants.length === 0) {
      console.warn('[DialoguePlayer] No participants data, using fallback');
    }

    // Proceed with render...
    this._renderHeader();
    this._renderMessages();
    this._renderControls();

  } catch (error) {
    console.error('[DialoguePlayer] Render failed:', error);
    this._showErrorState(error.message);
  }
}
```

**Acceptance Criteria**:
- [ ] Render does not crash when `thread` is null/undefined
- [ ] Render does not crash when `thread.messages` is empty array
- [ ] Descriptive error logged to console with component prefix
- [ ] Error state UI shown to user (not blank screen)

---

#### REQ-VIS-002: Loading State UI
**Priority**: P0

The dialogue player SHALL display a loading state while data is being fetched or processed, before content is ready.

**Specification**:
- State: `loading` (initial), `success` (ready), `error` (failed)
- Loading UI: Spinner + "Loading dialogue..." text
- Show loading state for minimum 300ms (prevent flash)
- Transition to success/error state after data ready

**Validation**:
```javascript
// In DialoguePlayer constructor
constructor(containerId, threadData) {
  this.container = document.getElementById(containerId);
  this.state = 'loading'; // Initial state
  this.thread = null;

  this._showLoadingState();

  // Simulate async data loading
  this._loadThreadData(threadData).then(() => {
    this.state = 'success';
    this._hideLoadingState();
    this._render();
  }).catch(error => {
    this.state = 'error';
    this._showErrorState(error.message);
  });
}

_showLoadingState() {
  this.container.innerHTML = `
    <div class="dialogue-player-loading">
      <div class="spinner"></div>
      <p>Loading dialogue...</p>
    </div>
  `;
}

_hideLoadingState() {
  const loadingEl = this.container.querySelector('.dialogue-player-loading');
  if (loadingEl) {
    loadingEl.remove();
  }
}
```

**CSS**:
```css
.dialogue-player-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  color: #6b7280;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #B85C3C; /* Warm terracotta */
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Acceptance Criteria**:
- [ ] Loading spinner displays on initialization
- [ ] Loading state visible for at least 300ms (no flash)
- [ ] Loading state disappears when data ready
- [ ] Smooth transition from loading → success

---

#### REQ-VIS-003: Error State UI
**Priority**: P0

When rendering fails, the dialogue player SHALL display a user-friendly error message with actionable feedback.

**Specification**:
- Error UI: Icon + error message + retry button
- Error types:
  - No data: "No dialogue data available"
  - Empty messages: "This dialogue has no messages"
  - Network error: "Failed to load dialogue. Please try again."
- Retry button triggers re-render attempt

**Validation**:
```javascript
_showErrorState(errorMessage) {
  this.container.innerHTML = `
    <div class="dialogue-player-error">
      <div class="error-icon">⚠️</div>
      <h3>Unable to Display Dialogue</h3>
      <p class="error-message">${this._sanitizeErrorMessage(errorMessage)}</p>
      <button class="error-retry-btn" onclick="location.reload()">Reload Page</button>
    </div>
  `;

  console.error('[DialoguePlayer] Error state shown:', errorMessage);
}

_sanitizeErrorMessage(message) {
  // Convert technical errors to user-friendly messages
  const errorMap = {
    'No dialogue thread data': 'No dialogue data available',
    'Thread has no messages': 'This dialogue has no messages',
    'Thread.messages is missing': 'Dialogue data is incomplete'
  };

  return errorMap[message] || 'An unexpected error occurred';
}
```

**CSS**:
```css
.dialogue-player-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.dialogue-player-error h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.error-message {
  font-size: 0.95rem;
  margin-bottom: 24px;
  max-width: 400px;
}

.error-retry-btn {
  padding: 10px 20px;
  background: #B85C3C;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.error-retry-btn:hover {
  background: #A04B2F;
}
```

**Acceptance Criteria**:
- [ ] Error state displays icon + message + retry button
- [ ] Technical errors converted to user-friendly text
- [ ] Retry button reloads page (or retries render)
- [ ] Error logged to console with stack trace

---

#### REQ-VIS-004: Console Logging for Debugging
**Priority**: P1

All render operations SHALL log key milestones to the console with component prefixes for debugging.

**Specification**:
- Prefix: `[DialoguePlayer]`
- Log levels: `log` (info), `warn` (recoverable), `error` (critical)
- Key events:
  - Component initialization
  - Data loaded successfully
  - Render started/completed
  - Errors with stack traces

**Validation**:
```javascript
constructor(containerId, threadData) {
  console.log('[DialoguePlayer] Initializing with thread:', threadData?.id);
  // ...
}

_loadThreadData(threadData) {
  console.log('[DialoguePlayer] Loading thread data...');
  return new Promise((resolve, reject) => {
    if (!threadData) {
      reject(new Error('No thread data provided'));
      return;
    }

    this.thread = threadData;
    console.log('[DialoguePlayer] Thread data loaded:', {
      id: this.thread.id,
      messages: this.thread.messages?.length || 0,
      participants: this.thread.participants?.length || 0
    });
    resolve();
  });
}

_render() {
  console.log('[DialoguePlayer] Render started');

  try {
    // ... render logic ...
    console.log('[DialoguePlayer] Render completed successfully');
  } catch (error) {
    console.error('[DialoguePlayer] Render failed:', error);
    console.error('[DialoguePlayer] Stack trace:', error.stack);
  }
}
```

**Acceptance Criteria**:
- [ ] All logs use `[DialoguePlayer]` prefix
- [ ] Initialization logs thread ID and message count
- [ ] Render completion logged on success
- [ ] Errors logged with full stack traces
- [ ] Logs are concise and actionable

---

#### REQ-VIS-005: Data Validation on Load
**Priority**: P1

The dialogue player SHALL validate thread data structure on load and reject invalid data early.

**Specification**:
- Validate required fields: `id`, `topic`, `messages`, `participants`
- Validate message structure: `id`, `personaId`, `text`
- Validate participant structure: `personaId`, `name`
- Throw descriptive error for first validation failure

**Validation**:
```javascript
_validateThreadData(thread) {
  // Required top-level fields
  if (!thread.id) {
    throw new Error('Thread missing required field: id');
  }
  if (!thread.topic || !thread.topic.zh) {
    throw new Error('Thread missing required field: topic.zh');
  }
  if (!Array.isArray(thread.messages)) {
    throw new Error('Thread.messages must be an array');
  }
  if (!Array.isArray(thread.participants)) {
    throw new Error('Thread.participants must be an array');
  }

  // Validate messages
  thread.messages.forEach((msg, idx) => {
    if (!msg.id) {
      throw new Error(`Message ${idx} missing required field: id`);
    }
    if (!msg.personaId) {
      throw new Error(`Message ${msg.id} missing required field: personaId`);
    }
    if (!msg.text || !msg.text.zh) {
      throw new Error(`Message ${msg.id} missing required field: text.zh`);
    }
  });

  // Validate participants
  thread.participants.forEach((p, idx) => {
    if (!p.personaId) {
      throw new Error(`Participant ${idx} missing required field: personaId`);
    }
  });

  console.log('[DialoguePlayer] Data validation passed');
}

_loadThreadData(threadData) {
  return new Promise((resolve, reject) => {
    try {
      this._validateThreadData(threadData);
      this.thread = threadData;
      resolve();
    } catch (error) {
      console.error('[DialoguePlayer] Data validation failed:', error);
      reject(error);
    }
  });
}
```

**Acceptance Criteria**:
- [ ] Invalid data rejected with descriptive error
- [ ] Missing required fields detected early
- [ ] Malformed arrays/objects rejected
- [ ] Valid data passes without errors

---

#### REQ-VIS-006: Empty State for Zero Messages
**Priority**: P2

If a thread has zero messages (valid but empty), the dialogue player SHALL display an empty state UI.

**Specification**:
- Empty state UI: Icon + message "This dialogue has no messages yet"
- No error styling (not a failure, just empty)
- Optional: "Add a message" button (if editing supported)

**Validation**:
```javascript
_render() {
  try {
    this._validateThreadData(this.thread);

    // Special case: zero messages
    if (this.thread.messages.length === 0) {
      this._showEmptyState();
      return;
    }

    // Normal render...
  } catch (error) {
    this._showErrorState(error.message);
  }
}

_showEmptyState() {
  this.container.innerHTML = `
    <div class="dialogue-player-empty">
      <div class="empty-icon">💬</div>
      <h3>No Messages Yet</h3>
      <p>This dialogue has no messages to display.</p>
    </div>
  `;
}
```

**CSS**:
```css
.dialogue-player-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px;
  text-align: center;
  color: #9ca3af;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.dialogue-player-empty h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
}
```

**Acceptance Criteria**:
- [ ] Empty state shown when `messages.length === 0`
- [ ] Empty state visually distinct from error state
- [ ] No console errors logged
- [ ] Graceful, not alarming

---

### MODIFIED

None (new error handling added, existing logic extended)

---

### REMOVED

None

---

## Scenarios

### Scenario 1: Render Succeeds with Valid Data

**Given** a dialogue thread with 5 messages and 3 participants
**When** the dialogue player is initialized
**Then** the loading state MUST display for at least 300ms
**And** the component MUST validate the thread data
**And** all 5 messages MUST render successfully
**And** the console MUST log "Render completed successfully"

**Validation**:
```javascript
const threadData = {
  id: 'thread-1',
  topic: { zh: '测试对话', en: 'Test Dialogue' },
  messages: [/* 5 valid messages */],
  participants: [/* 3 valid participants */]
};

const startTime = Date.now();
const player = new DialoguePlayer('container', threadData);

// Wait for loading state
setTimeout(() => {
  const loadingEl = document.querySelector('.dialogue-player-loading');
  assert(loadingEl !== null, 'Loading state visible');

  const elapsed = Date.now() - startTime;
  assert(elapsed >= 300, 'Loading state shown for >= 300ms');
}, 100);

// Wait for render complete
setTimeout(() => {
  const messages = document.querySelectorAll('.dialogue-message');
  assert(messages.length === 5, '5 messages rendered');

  // Check console logs (in test environment, mock console.log)
  assert(consoleLogSpy.calledWith('[DialoguePlayer] Render completed successfully'));
}, 1000);
```

---

### Scenario 2: Render Fails with Missing Data

**Given** a dialogue thread with `null` messages array
**When** the dialogue player is initialized
**Then** data validation MUST fail
**And** the error state UI MUST display
**And** the error message MUST be "Dialogue data is incomplete"
**And** the console MUST log the error with stack trace

**Validation**:
```javascript
const invalidData = {
  id: 'thread-1',
  topic: { zh: '测试' },
  messages: null, // Invalid
  participants: []
};

const player = new DialoguePlayer('container', invalidData);

setTimeout(() => {
  const errorEl = document.querySelector('.dialogue-player-error');
  assert(errorEl !== null, 'Error state visible');

  const errorMsg = errorEl.querySelector('.error-message').textContent;
  assert(errorMsg === 'Dialogue data is incomplete', 'User-friendly error shown');

  // Check console
  assert(consoleErrorSpy.calledWithMatch(/Data validation failed/));
}, 500);
```

---

### Scenario 3: Render Handles Empty Message Array

**Given** a dialogue thread with 0 messages (empty array)
**When** the dialogue player is initialized
**Then** data validation MUST pass (empty is valid)
**And** the empty state UI MUST display
**And** the message MUST be "This dialogue has no messages yet"
**And** no errors MUST be logged

**Validation**:
```javascript
const emptyData = {
  id: 'thread-1',
  topic: { zh: '空对话', en: 'Empty Dialogue' },
  messages: [], // Valid but empty
  participants: []
};

const player = new DialoguePlayer('container', emptyData);

setTimeout(() => {
  const emptyEl = document.querySelector('.dialogue-player-empty');
  assert(emptyEl !== null, 'Empty state visible');

  const heading = emptyEl.querySelector('h3').textContent;
  assert(heading === 'No Messages Yet', 'Empty state heading correct');

  // No errors logged
  assert(consoleErrorSpy.notCalled, 'No errors logged');
}, 500);
```

---

### Scenario 4: Loading State Prevents Flash

**Given** a dialogue thread that loads in 100ms
**When** the dialogue player is initialized
**Then** the loading state MUST remain visible for at least 300ms
**And** no content flash MUST occur before loading completes

**Validation**:
```javascript
const fastData = { /* valid data */ };
const startTime = Date.now();

const player = new DialoguePlayer('container', fastData);

// Check at 150ms (data ready, but loading still shown)
setTimeout(() => {
  const loadingEl = document.querySelector('.dialogue-player-loading');
  assert(loadingEl !== null, 'Loading state still visible at 150ms');
}, 150);

// Check at 350ms (loading should now be hidden)
setTimeout(() => {
  const loadingEl = document.querySelector('.dialogue-player-loading');
  assert(loadingEl === null, 'Loading state hidden after 300ms');

  const messages = document.querySelectorAll('.dialogue-message');
  assert(messages.length > 0, 'Messages now visible');
}, 350);
```

---

### Scenario 5: Error State Shows Retry Button

**Given** rendering has failed with an error
**When** the error state UI is displayed
**Then** a retry button MUST be visible
**And** clicking the button MUST reload the page (or retry render)

**Validation**:
```javascript
const invalidData = { /* invalid data */ };
const player = new DialoguePlayer('container', invalidData);

setTimeout(() => {
  const errorEl = document.querySelector('.dialogue-player-error');
  const retryBtn = errorEl.querySelector('.error-retry-btn');

  assert(retryBtn !== null, 'Retry button exists');
  assert(retryBtn.textContent === 'Reload Page', 'Button text correct');

  // Simulate click
  const reloadSpy = jest.spyOn(window.location, 'reload');
  retryBtn.click();

  assert(reloadSpy.called, 'Page reload triggered');
}, 500);
```

---

## Dependencies

- **Upstream**: None (foundational error handling)
- **Downstream**: All other specs depend on this for data integrity

---

## Testing Strategy

### Manual Testing
1. **Valid Data**: Initialize with complete data, verify successful render
2. **Missing Data**: Initialize with null/undefined thread, verify error state
3. **Empty Messages**: Initialize with 0 messages, verify empty state
4. **Network Simulation**: Delay data loading, verify loading state persists

### Automated Testing
1. **Unit Tests**: Test `_validateThreadData()` with various invalid inputs
2. **State Machine Tests**: Test transitions: loading → success, loading → error
3. **UI Rendering Tests**: Verify loading/error/empty state HTML structure
4. **Console Logging Tests**: Verify all logs are called with correct prefixes

---

## Error Messages Reference

| Technical Error | User-Friendly Message |
|----------------|----------------------|
| `No dialogue thread data provided` | No dialogue data available |
| `Thread.messages is missing or invalid` | Dialogue data is incomplete |
| `Thread has no messages` | This dialogue has no messages |
| `Message X missing required field: Y` | Dialogue data is incomplete |
| Network timeout | Failed to load dialogue. Please try again. |

---

## Performance

### Optimization
- Validate data only once on load (cache validation result)
- Use minimum loading time (300ms) only for fast loads (<100ms)
- Lazy-render error states (don't pre-create error DOM)

---

## Accessibility

### Screen Reader Support
- **Loading state**: "Loading dialogue, please wait"
- **Error state**: "Error: Unable to display dialogue. [error message]. Press reload button to try again."
- **Empty state**: "This dialogue has no messages yet"

**ARIA**:
```html
<div class="dialogue-player-loading" role="status" aria-live="polite" aria-label="Loading dialogue">
  <div class="spinner" aria-hidden="true"></div>
  <p>Loading dialogue...</p>
</div>

<div class="dialogue-player-error" role="alert" aria-live="assertive">
  <h3>Unable to Display Dialogue</h3>
  <p class="error-message">Dialogue data is incomplete</p>
  <button class="error-retry-btn">Reload Page</button>
</div>
```

---

## Migration Notes

### Breaking Changes
None - this is additive error handling. Existing valid data continues to work.

### Rollback
Remove defensive checks (not recommended - may expose crashes):
```javascript
_render() {
  // Revert to original (no try-catch)
  this._renderHeader();
  this._renderMessages();
  this._renderControls();
}
```

---

## Success Metrics

- [ ] Zero blank/empty panels reported by users
- [ ] All render errors logged with descriptive messages
- [ ] Loading state visible for >= 300ms on fast connections
- [ ] Error state shows user-friendly messages (not technical jargon)
- [ ] Empty state gracefully handles zero-message threads
- [ ] Console logs help debugging (no silent failures)
