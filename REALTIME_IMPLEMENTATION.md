# JobBox Portal — Realtime System Hardening Implementation Report

## Overview

This document provides a detailed breakdown of the architectural changes made to harden the real-time system across the **JobBox Portal** application. It covers:
1. **Root Cause Analysis**
2. **Files Created & Modified (What and Why)**
3. **Architecture Before vs. After**
4. **Socket Lifecycle & Room Management**
5. **Event Contracts & Cache Synchronization**
6. **Reconnection & State Reconciliation**
7. **Verification & Testing Results**

---

## 1. Root Cause Analysis

### The Problem
When testing with multiple logged-in accounts (e.g., Account A and Account B):
- Account A performs an action (sends a chat message, connection request, or moves an ATS applicant card).
- Backend successfully commits the change to MongoDB.
- Account B (already open) did not consistently reflect the update in real-time.
- Account B had to manually refresh the page to see the new data.

### Root Causes Identified
1. **Fragmented Socket Lifecycle (Multiple Competing Connections)**:
   - `NotificationContext`, `useChatSocket`, and `useAtsRealtimeSync` each created their own isolated `io()` connections.
   - A single browser tab had up to **3 separate Socket.IO connections** running simultaneously.
   - When components mounted/unmounted (e.g. navigating between routes), socket disconnects caused race conditions and listener churn on the server's `onlineUsersMap`.

2. **Reconnection Room Dropping**:
   - On temporary network drops or socket re-connections, active conversation rooms (`conversation_${id}`) and ATS job rooms (`job_ats_${id}`) were not automatically re-subscribed.
   - The client remained connected to the base socket but was no longer inside the entity rooms required to receive `message_received` or `application:status_changed` broadcasts.

3. **React Query / Redux Cache Synchronization Inconsistencies**:
   - `conversation_updated` updated Redux `unreadTotalCount` but did not invalidate the `["unread-chat-count"]` React Query key.
   - `useSendMessage` did not invalidate `["unread-chat-count"]`.

---

## 2. Files Created & Modified

### 1. `client/src/shared/context/RealtimeContext.tsx` [NEW]
- **What Changed**: Created a central `RealtimeProvider` and `useRealtime()` hook.
- **Why**:
  - Guarantees **exactly ONE authenticated Socket.IO connection per browser tab**.
  - Owns socket creation, JWT authentication, connection, disconnection, and auto-reconnection.
  - Maintains an active room registry (`activeRoomsRef`) that automatically re-emits `join_conversation`, `join_ats_recruiter`, and `join_ats_job` on reconnect.
  - Performs state reconciliation on reconnect (invalidates `["notifications"]`, `["conversations"]`, `["unread-chat-count"]`, `["connections"]`, `["applications"]`).
  - Subscribes globally to `online_users` and dispatches to the Redux store.

### 2. `client/src/app/providers/AppProvider.tsx` [MODIFIED]
- **What Changed**: Wrapped downstream contexts and components with `<RealtimeProvider>`.
- **Why**: Ensures the single socket instance is initialized once at the root level under `<AuthProvider>` and is accessible to all features (Chat, Notifications, ATS, Networking).

### 3. `client/src/shared/context/NotificationContext.tsx` [MODIFIED]
- **What Changed**: Removed the independent `io()` connection initialization and subscribed to the shared socket via `useRealtime()`.
- **Why**:
  - Eliminates duplicate socket connections.
  - Preserves all existing notification features: sound chime, custom toast notifications, unread count badge, dynamic document title sync, and targeted React Query cache invalidations.

### 4. `client/src/features/chat/hooks/useChatSocket.ts` [MODIFIED]
- **What Changed**: Replaced module-level singleton socket lifecycle with `useRealtime()`.
- **Why**:
  - Eliminates duplicate socket connections while preserving room join/leave semantics.
  - Optimistically updates `["messages", conversationId, 1, 50]` on `message_received`.
  - Reconciles conversation previews and unread badges on `conversation_updated` and `unread_count_updated`.
  - Handles `messages_read` double ticks, `message_edited`, `message_deleted`, and debounced typing indicators without stale closures.

### 5. `client/src/features/recruiter/hooks/useAtsRealtimeSync.ts` [MODIFIED]
- **What Changed**: Replaced independent `io()` socket initialization with `useRealtime()`.
- **Why**:
  - Eliminates the 3rd duplicate socket connection.
  - Automatically joins `join_ats_recruiter` and `join_ats_job(jobId)` through `RealtimeContext`.
  - Retains optimistic Kanban column updates and `processedEventsRef` event deduplication.

### 6. `client/src/features/chat/hooks/useChat.ts` [MODIFIED]
- **What Changed**: Added `["unread-chat-count"]` invalidation to `useSendMessage` mutation.
- **Why**: Ensures the sender's unread badges and total count remain fully synchronized when sending messages via REST mutations.

---

## 3. Architecture Comparison

### Before Hardening
```text
┌────────────────────────────────────────────────────────────┐
│                        Browser Tab                         │
├──────────────────────┬──────────────────────┬──────────────┤
│ NotificationContext  │    useChatSocket     │useAtsRealtime│
│  [Socket Instance 1] │  [Socket Instance 2] │[Socket Inst 3│
└──────────┬───────────┴──────────┬───────────┴──────┬───────┘
           │                      │                  │
           ▼                      ▼                  ▼
    3 Independent Socket Connections to Node.js Backend
```

### After Hardening
```text
┌────────────────────────────────────────────────────────────┐
│                        Browser Tab                         │
│                                                            │
│                      RealtimeProvider                      │
│                [ONE Shared Socket Instance]                │
├──────────────────────┬──────────────────────┬──────────────┤
│ NotificationContext  │    useChatSocket     │useAtsRealtime│
│ (Subscribes to Event)│ (Subscribes to Event)│(Subscribes to│
└──────────┬───────────┴──────────┬───────────┴──────┬───────┘
           │                      │                  │
           └──────────────────────┼──────────────────┘
                                  │
                                  ▼
             ONE Authenticated Socket.IO Connection
                                  │
                                  ▼
                           Node.js Server
                                  │
                       User & Entity Rooms
               (user_<id>, conversation_<id>, job_ats_<id>)
                                  │
                                  ▼
                         MongoDB Database
```

---

## 4. Realtime Event & Cache Synchronization Matrix

| Event | Direction | Target Room | Cache / State Synchronized |
| :--- | :--- | :--- | :--- |
| `message_received` | Server → Client | `conversation_${convId}` | Appends to `["messages", convId, 1, 50]`, invalidates `["conversations"]` & `["unread-chat-count"]`. |
| `conversation_updated` | Server → Client | `user_${recipientId}` | Updates Redux unread count, invalidates `["conversations"]` & `["unread-chat-count"]`. |
| `unread_count_updated` | Server → Client | `user_${userId}` | Updates Redux `unreadTotalCount`, invalidates `["unread-chat-count"]`. |
| `messages_read` | Server → Client | `conversation_${convId}`, `user_${userId}` | Updates read ticks (`isRead: true`), clears unread count for conversation. |
| `message_edited` | Server → Client | `conversation_${convId}` | Updates message content in `["messages", convId, 1, 50]` and `["conversations"]`. |
| `message_deleted` | Server → Client | `conversation_${convId}` | Masks deleted message content or filters deleted message. |
| `user_typing` / `user_stop_typing` | Server → Client | `conversation_${convId}` | Dispatches typing indicators to Redux with auto-cleanup timeouts. |
| `notification:new` | Server → Client | `user_${recipientId}` | Prepends notification, plays chime sound, triggers toast, invalidates `["notifications"]`, `["connections"]`, `["posts"]`, `["applications"]`. |
| `notification:unread_count` | Server → Client | `user_${recipientId}` | Updates notification unread counter and dynamic browser document title. |
| `application:status_changed` | Server → Client | `job_ats_${jobId}`, `recruiter_ats_${id}` | Optimistically updates Kanban column in `["applications"]`, invalidates `["dashboard"]`. |
| `online_users` | Server → Client | Global Broadcast | Updates online presence list in Redux `chatSlice`. |

---

## 5. Non-Negotiable Safety Rules Followed

- **ZERO MongoDB Schema Changes**: Database models and indices are 100% intact.
- **ZERO REST API Contract Changes**: All endpoints and payloads remain unchanged.
- **ZERO Event Renaming**: All Socket.IO event names and contracts remain identical.
- **ZERO Polling / Workarounds**: No `setInterval()` or artificial polling added.
- **Framework Integrity**: React Query, Redux Toolkit, and Socket.IO preserved without introducing external brokers (Redis/Kafka/RabbitMQ).

---

## 6. Verification Results

- **TypeScript Compilation**: `tsc -b && vite build` passed with **0 errors**.
- **Bundle Generation**: Production assets successfully generated.
- **Multi-Account Realtime Flow**:
  - Message sent by Account A immediately appears for Account B without page refresh.
  - Connection request from Account A immediately displays notification toast, badge, and invitation list on Account B without page refresh.
  - Recruiter Kanban status update immediately reflects on teammate/candidate screens without page refresh.
