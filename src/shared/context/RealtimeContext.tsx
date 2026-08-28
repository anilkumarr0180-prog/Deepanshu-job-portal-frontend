import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useAuth from "@/features/auth/hooks/useAuth";
import {
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
  setUnreadTotalCount,
  incrementUnreadCount,
  decrementUnreadCount,
} from "@/features/chat/store/chatSlice";
import { type ChatMessage, getUserIdString } from "@/features/chat/types/chat.types";
import type { CallHistoryItem } from "@/features/call/types/call.types";
import type { Interview } from "@/features/recruiter/types/interview.types";

interface RealtimeContextValue {
  socket: Socket | null;
  isConnected: boolean;
  activeConversationId: string | null;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  joinAtsRecruiter: () => void;
  joinAtsJob: (jobId: string) => void;
  leaveAtsJob: (jobId: string) => void;
}

const RealtimeContext = createContext<RealtimeContextValue | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const currentUserId = user?.id || (user as any)?._id || "";
  const currentUserIdRef = useRef<string>(currentUserId);
  currentUserIdRef.current = currentUserId;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Active rooms registry to restore automatically on reconnect
  const activeRoomsRef = useRef<Set<string>>(new Set());
  const activeConversationIdRef = useRef<string | null>(null);
  const activeAtsJobIdRef = useRef<string | null>(null);
  const isAtsRecruiterJoinedRef = useRef<boolean>(false);
  const isReconnectingRef = useRef<boolean>(false);

  // Typing timers & deduplication refs
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const processedReadEventsRef = useRef<Set<string>>(new Set());

  // Helper to resolve backend websocket URL
  const getBackendUrl = useCallback(() => {
    const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    return rawApiUrl.replace(/\/api\/?$/, "");
  }, []);

  // State reconciliation on reconnect only
  const reconcilePersistentState = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["notifications"] });
    void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    void queryClient.invalidateQueries({ queryKey: ["unread-chat-count"] });
    void queryClient.invalidateQueries({ queryKey: ["connections"] });
    void queryClient.invalidateQueries({ queryKey: ["connection-status"] });
    void queryClient.invalidateQueries({ queryKey: ["applications"] });
    void queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    void queryClient.invalidateQueries({ queryKey: ["call-history"] });
    void queryClient.invalidateQueries({ queryKey: ["unread-missed-calls-count"] });
    void queryClient.invalidateQueries({ queryKey: ["interviews"] });
  }, [queryClient]);

  // Restore room subscriptions on reconnect
  const restoreActiveRooms = useCallback((sock: Socket) => {
    if (!sock.connected) return;

    if (activeConversationIdRef.current) {
      sock.emit("join_conversation", {
        conversationId: activeConversationIdRef.current,
      });
    }

    if (isAtsRecruiterJoinedRef.current) {
      sock.emit("join_ats_recruiter");
    }

    if (activeAtsJobIdRef.current) {
      sock.emit("join_ats_job", {
        jobId: activeAtsJobIdRef.current,
      });
    }

    activeRoomsRef.current.forEach((room) => {
      if (room.startsWith("conversation_")) {
        const convId = room.replace("conversation_", "");
        sock.emit("join_conversation", { conversationId: convId });
      } else if (room.startsWith("job_ats_")) {
        const jobId = room.replace("job_ats_", "");
        sock.emit("join_ats_job", { jobId });
      }
    });
  }, []);

  // Initialize and manage single authenticated Socket.IO connection
  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const backendUrl = getBackendUrl();

    const socketInstance = io(backendUrl, {
      auth: { token: `Bearer ${token}` },
      transports: ["polling", "websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5,
      autoConnect: true,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
      restoreActiveRooms(socketInstance);
      if (isReconnectingRef.current) {
        reconcilePersistentState();
        isReconnectingRef.current = false;
      }
    });

    socketInstance.on("disconnect", (reason) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        socketInstance.connect();
      } else {
        isReconnectingRef.current = true;
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("Realtime socket connection error:", err.message);
      isReconnectingRef.current = true;
    });

    // Presence Subscription
    socketInstance.on("online_users", (users: string[]) => {
      if (Array.isArray(users)) {
        dispatch(setOnlineUsers(users));
      }
    });

    /* -------------------------------------------------------------------------- */
    /* SINGLE GLOBAL CHAT EVENT SUBSCRIBERS (Zero Multiplier, Direct Cache Sync)   */
    /* -------------------------------------------------------------------------- */

    // 1. Message Received (Guaranteed Realtime Cache Sync)
    const handleMessageReceived = (data: { message: ChatMessage; conversationId: string }) => {
      const { message, conversationId } = data;
      if (!message || !conversationId) return;
      const senderIdStr = getUserIdString(message.senderId);
      const isViewing = activeConversationIdRef.current === conversationId;
      const isFromOther = senderIdStr !== currentUserIdRef.current;

      // Unhide conversation if it was deleted previously (user-namespaced)
      try {
        const key = "jobbox_deleted_convs_" + currentUserIdRef.current;
        const deletedMap = JSON.parse(localStorage.getItem(key) || "{}");
        if (deletedMap[conversationId]) {
          delete deletedMap[conversationId];
          localStorage.setItem(key, JSON.stringify(deletedMap));
        }
      } catch {
        // ignore
      }

      // Clear any active typing indicator for sender
      if (isFromOther) {
        dispatch(setUserStopTyping({ conversationId, userId: senderIdStr }));
      }

      // Optimistically append to all cached message lists for this conversation
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old: any) => {
          if (!old) return { messages: [message] };
          if (Array.isArray(old)) {
            const exists = old.some((m) => (m._id || m.id) === (message._id || message.id));
            if (exists) return old;
            return [...old, message];
          }
          if (Array.isArray(old.messages)) {
            const exists = old.messages.some((m: any) => (m._id || m.id) === (message._id || message.id));
            if (exists) return old;
            return { ...old, messages: [...old.messages, message] };
          }
          if (Array.isArray(old.items)) {
            const exists = old.items.some((m: any) => (m._id || m.id) === (message._id || message.id));
            if (exists) return old;
            return { ...old, items: [...old.items, message] };
          }
          return { ...old, messages: [message] };
        }
      );

      // Update conversation preview and unread count
      let foundInCache = false;
      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          let targetConv: any = null;
          const remainingConvs = old.conversations.filter((c: any) => {
            if ((c._id || c.id) === conversationId) {
              foundInCache = true;
              targetConv = {
                ...c,
                lastMessageId: message,
                lastMessageAt: message.createdAt || new Date().toISOString(),
                unreadCount: isViewing || !isFromOther ? 0 : (c.unreadCount || 0) + 1,
              };
              return false;
            }
            return true;
          });
          return {
            ...old,
            conversations: targetConv ? [targetConv, ...remainingConvs] : old.conversations,
          };
        }
      );

      // If conversation is brand new for this user, fetch it so sidebar shows it immediately
      if (!foundInCache) {
        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }

      // If NOT viewing and from other user, increment global unread count
      if (!isViewing && isFromOther) {
        dispatch(incrementUnreadCount());
        queryClient.setQueryData(["unread-chat-count"], (prev: number | undefined) =>
          typeof prev === "number" ? prev + 1 : 1
        );
      }

      // If actively looking at this conversation, auto mark as read
      if (isViewing && isFromOther) {
        socketInstance.emit("mark_read", { conversationId });
      }
    };

    // 2. Conversation Updated (Handles background message arrives for recipient or preview update for sender)
    const handleConversationUpdated = (data: {
      conversationId: string;
      lastMessage: ChatMessage;
      unreadTotal?: number;
      unreadCount?: number;
    }) => {
      if (typeof data.unreadTotal === "number") {
        dispatch(setUnreadTotalCount(data.unreadTotal));
        queryClient.setQueryData(["unread-chat-count"], data.unreadTotal);
      }

      if (data.conversationId && data.lastMessage) {
        const isViewing = activeConversationIdRef.current === data.conversationId;
        const senderIdStr = getUserIdString(data.lastMessage.senderId);
        const isFromOther = senderIdStr !== currentUserIdRef.current;

        // If viewing this conversation, ensure the message is appended to the active chat window cache
        if (isViewing) {
          queryClient.setQueriesData(
            { queryKey: ["messages", data.conversationId] },
            (old: any) => {
              if (!old) return { messages: [data.lastMessage] };
              if (Array.isArray(old)) {
                const exists = old.some((m) => (m._id || m.id) === (data.lastMessage._id || data.lastMessage.id));
                if (exists) return old;
                return [...old, data.lastMessage];
              }
              if (Array.isArray(old.messages)) {
                const exists = old.messages.some((m: any) => (m._id || m.id) === (data.lastMessage._id || data.lastMessage.id));
                if (exists) return old;
                return { ...old, messages: [...old.messages, data.lastMessage] };
              }
              if (Array.isArray(old.items)) {
                const exists = old.items.some((m: any) => (m._id || m.id) === (data.lastMessage._id || data.lastMessage.id));
                if (exists) return old;
                return { ...old, items: [...old.items, data.lastMessage] };
              }
              return { ...old, messages: [data.lastMessage] };
            }
          );

          if (isFromOther) {
            socketInstance.emit("mark_read", { conversationId: data.conversationId });
          }
        }

        let foundInCache = false;
        queryClient.setQueriesData(
          { queryKey: ["conversations"] },
          (old: any) => {
            if (!old?.conversations) return old;
            let targetConv: any = null;
            const remainingConvs = old.conversations.filter((c: any) => {
              if ((c._id || c.id) === data.conversationId) {
                foundInCache = true;
                const alreadyUpdatedWithMsg =
                  (c.lastMessageId?._id || c.lastMessageId?.id) ===
                  (data.lastMessage._id || data.lastMessage.id);

                let nextUnread = c.unreadCount || 0;
                if (typeof data.unreadCount === "number") {
                  nextUnread = data.unreadCount;
                } else if (isViewing || !isFromOther) {
                  nextUnread = 0;
                } else if (!alreadyUpdatedWithMsg) {
                  nextUnread = (c.unreadCount || 0) + 1;
                }

                targetConv = {
                  ...c,
                  lastMessageId: data.lastMessage,
                  lastMessageAt: data.lastMessage.createdAt || new Date().toISOString(),
                  unreadCount: nextUnread,
                };
                return false;
              }
              return true;
            });

            return {
              ...old,
              conversations: targetConv ? [targetConv, ...remainingConvs] : old.conversations,
            };
          }
        );

        if (!foundInCache) {
          void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        }
      }
    };

    // 3. Unread Count Updated
    const handleUnreadCountUpdated = (data: { unreadTotal: number }) => {
      if (typeof data.unreadTotal === "number") {
        dispatch(setUnreadTotalCount(data.unreadTotal));
        queryClient.setQueryData(["unread-chat-count"], data.unreadTotal);
      }
    };

    // 4. Messages Read (with Deduplication)
    const handleMessagesRead = (data: {
      conversationId: string;
      readByUserId: string;
      readAt: string;
    }) => {
      if (!data?.conversationId || !data?.readByUserId) return;
      const eventKey = `${data.conversationId}:${data.readByUserId}:${data.readAt || ""}`;
      if (processedReadEventsRef.current.has(eventKey)) {
        return; // Already processed this logical read event
      }
      processedReadEventsRef.current.add(eventKey);
      if (processedReadEventsRef.current.size > 200) {
        processedReadEventsRef.current.clear();
      }

      // Update double ticks in all cached message lists for this conversation
      queryClient.setQueriesData(
        { queryKey: ["messages", data.conversationId] },
        (old: { messages: ChatMessage[] } | undefined) => {
          if (!old?.messages) return old;
          return {
            ...old,
            messages: old.messages.map((msg) => {
              const senderIdStr = getUserIdString(msg.senderId);
              if (senderIdStr !== data.readByUserId) {
                return { ...msg, isRead: true, readAt: data.readAt };
              }
              return msg;
            }),
          };
        }
      );

      // If current user is the one who read the messages, update conversation unread count and decrement global
      if (data.readByUserId === currentUserIdRef.current) {
        let clearedUnread = 0;
        const allConvData: any = queryClient.getQueriesData({ queryKey: ["conversations"] });
        if (Array.isArray(allConvData)) {
          for (const [, cacheVal] of allConvData) {
            if (cacheVal?.conversations) {
              const target = cacheVal.conversations.find(
                (c: any) => (c._id || c.id) === data.conversationId
              );
              if (target && target.unreadCount > 0) {
                clearedUnread = Math.max(clearedUnread, target.unreadCount);
              }
            }
          }
        }

        if (clearedUnread > 0) {
          dispatch(decrementUnreadCount(clearedUnread));
          queryClient.setQueryData(["unread-chat-count"], (prev: number | undefined) =>
            typeof prev === "number" ? Math.max(0, prev - clearedUnread) : 0
          );
        }
      }

      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) =>
              (c._id || c.id) === data.conversationId
                ? {
                    ...c,
                    unreadCount:
                      data.readByUserId === currentUserIdRef.current ? 0 : c.unreadCount,
                    lastMessageId: c.lastMessageId
                      ? { ...c.lastMessageId, isRead: true }
                      : c.lastMessageId,
                  }
                : c
            ),
          };
        }
      );
    };

    // 5. Message Edited
    const handleMessageEdited = (data: { message: ChatMessage; conversationId: string }) => {
      const { message, conversationId } = data;
      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
          if (!old?.messages) return old;
          return {
            ...old,
            messages: old.messages.map((m) =>
              (m._id || m.id) === (message._id || message.id) ? message : m
            ),
          };
        }
      );
      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) =>
              (c._id || c.id) === conversationId
                ? { ...c, lastMessageId: message }
                : c
            ),
          };
        }
      );
    };

    // 6. Message Deleted
    const handleMessageDeleted = (data: {
      message: ChatMessage;
      conversationId: string;
      deleteForEveryone: boolean;
      deletedByUserId: string;
    }) => {
      const { message, conversationId, deleteForEveryone, deletedByUserId } = data;

      queryClient.setQueriesData(
        { queryKey: ["messages", conversationId] },
        (old: { messages: ChatMessage[]; pagination?: unknown } | undefined) => {
          if (!old?.messages) return old;
          if (deleteForEveryone) {
            return {
              ...old,
              messages: old.messages.map((m) =>
                (m._id || m.id) === (message._id || message.id) ? message : m
              ),
            };
          } else {
            if (deletedByUserId === currentUserIdRef.current) {
              return {
                ...old,
                messages: old.messages.filter(
                  (m) => (m._id || m.id) !== (message._id || message.id)
                ),
              };
            }
          }
          return old;
        }
      );
    };

    // 7. Typing Indicators
    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
      userName?: string;
    }) => {
      if (data.userId === currentUserIdRef.current) return;
      dispatch(setUserTyping(data));
      const key = `${data.conversationId}_${data.userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
      }
      typingTimeoutsRef.current[key] = setTimeout(() => {
        dispatch(
          setUserStopTyping({
            conversationId: data.conversationId,
            userId: data.userId,
          })
        );
        delete typingTimeoutsRef.current[key];
      }, 3500);
    };

    const handleUserStopTyping = (data: { conversationId: string; userId: string }) => {
      if (data.userId === currentUserIdRef.current) return;
      dispatch(setUserStopTyping(data));
      const key = `${data.conversationId}_${data.userId}`;
      if (typingTimeoutsRef.current[key]) {
        clearTimeout(typingTimeoutsRef.current[key]);
        delete typingTimeoutsRef.current[key];
      }
    };

    // Register all socket event listeners ONCE
    socketInstance.on("message_received", handleMessageReceived);
    socketInstance.on("conversation_updated", handleConversationUpdated);
    socketInstance.on("unread_count_updated", handleUnreadCountUpdated);
    socketInstance.on("messages_read", handleMessagesRead);
    socketInstance.on("message_edited", handleMessageEdited);
    socketInstance.on("message_deleted", handleMessageDeleted);
    socketInstance.on("user_typing", handleUserTyping);
    socketInstance.on("user_stop_typing", handleUserStopTyping);

    // Call History Realtime Sync
    const processedCallHistoryRef = new Set<string>();
    const handleCallHistoryCreated = (data: CallHistoryItem) => {
      if (!data?.callId) return;
      if (processedCallHistoryRef.has(data.callId)) return;
      processedCallHistoryRef.add(data.callId);
      if (processedCallHistoryRef.size > 200) {
        processedCallHistoryRef.clear();
      }

      const convId =
        typeof data.conversationId === "object"
          ? data.conversationId?._id || data.conversationId?.id
          : data.conversationId;

      if (convId) {
        queryClient.setQueriesData(
          { queryKey: ["call-history", convId] },
          (old: { items: CallHistoryItem[]; pagination: any } | undefined) => {
            if (!old) {
              return {
                items: [data],
                pagination: {
                  page: 1,
                  limit: 50,
                  totalItems: 1,
                  totalPages: 1,
                  hasNextPage: false,
                  hasPrevPage: false,
                },
              };
            }
            const exists = old.items?.some((c) => c.callId === data.callId);
            if (exists) return old;
            return {
              ...old,
              items: [...(old.items || []), data],
              pagination: old.pagination
                ? { ...old.pagination, totalItems: (old.pagination.totalItems || 0) + 1 }
                : old.pagination,
            };
          }
        );
      }

      queryClient.setQueriesData(
        { queryKey: ["call-history"] },
        (old: { items: CallHistoryItem[]; pagination: any } | undefined) => {
          if (!old?.items) return old;
          const exists = old.items.some((c) => c.callId === data.callId);
          if (exists) return old;
          return {
            ...old,
            items: [data, ...old.items],
            pagination: old.pagination
              ? { ...old.pagination, totalItems: (old.pagination.totalItems || 0) + 1 }
              : old.pagination,
          };
        }
      );
    };

    const handleCallMissed = (data: CallHistoryItem) => {
      if (!data?.callId) return;
    };

    const handleCallMissedCountUpdated = (data: { unreadMissedCallCount: number }) => {
      if (typeof data.unreadMissedCallCount === "number") {
        queryClient.setQueryData(["unread-missed-calls-count"], data.unreadMissedCallCount);
      }
    };

    socketInstance.on("call:history_created", handleCallHistoryCreated);
    socketInstance.on("call:missed", handleCallMissed);
    socketInstance.on("call:missed_count_updated", handleCallMissedCountUpdated);

    // 8. Interview Realtime Synchronization (Single source of truth, Idempotent, Stale-event protected)
    const handleInterviewUpdated = (data: {
      interview: Interview;
      action?: string;
    }) => {
      if (!data?.interview) return;
      const { interview } = data;
      const interviewId = interview._id || (interview as any).id;
      if (!interviewId) return;

      const appId =
        typeof interview.applicationId === "object"
          ? (interview.applicationId as any)?._id || (interview.applicationId as any)?.id
          : interview.applicationId;

      // 1. Synchronize application multi-round interviews cache: ["interviews", "application", appId]
      if (appId) {
        queryClient.setQueriesData(
          { queryKey: ["interviews", "application", appId] },
          (oldData: Interview[] | undefined) => {
            if (!oldData || !Array.isArray(oldData)) {
              return [interview];
            }

            const existingIdx = oldData.findIndex(
              (item) => (item._id || (item as any).id) === interviewId
            );

            if (existingIdx >= 0) {
              const existingItem = oldData[existingIdx];
              const existingUpdatedAt = new Date(existingItem.updatedAt || 0).getTime();
              const newUpdatedAt = new Date(interview.updatedAt || 0).getTime();

              // Stale event protection: do not overwrite newer cached data with older event
              if (existingUpdatedAt > newUpdatedAt) {
                return oldData;
              }

              const updatedList = [...oldData];
              updatedList[existingIdx] = { ...existingItem, ...interview };
              return updatedList;
            }

            return [...oldData, interview];
          }
        );
      }

      // 2. Synchronize list interviews cache: ["interviews"]
      queryClient.setQueriesData(
        { queryKey: ["interviews"] },
        (oldData: any) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            const existingIdx = oldData.findIndex(
              (item) => (item._id || item.id) === interviewId
            );
            if (existingIdx >= 0) {
              const existing = oldData[existingIdx];
              if (
                new Date(existing.updatedAt || 0).getTime() >
                new Date(interview.updatedAt || 0).getTime()
              ) {
                return oldData;
              }
              const updated = [...oldData];
              updated[existingIdx] = { ...existing, ...interview };
              return updated;
            }
            return [interview, ...oldData];
          }

          if (Array.isArray(oldData.items)) {
            const existingIdx = oldData.items.findIndex(
              (item: any) => (item._id || item.id) === interviewId
            );
            if (existingIdx >= 0) {
              const existing = oldData.items[existingIdx];
              if (
                new Date(existing.updatedAt || 0).getTime() >
                new Date(interview.updatedAt || 0).getTime()
              ) {
                return oldData;
              }
              const updatedItems = [...oldData.items];
              updatedItems[existingIdx] = { ...existing, ...interview };
              return { ...oldData, items: updatedItems };
            }
            return {
              ...oldData,
              items: [interview, ...oldData.items],
              pagination: oldData.pagination
                ? { ...oldData.pagination, total: (oldData.pagination.total || 0) + 1 }
                : oldData.pagination,
            };
          }

          return oldData;
        }
      );

      // 3. Synchronize single interview query cache: ["interviews", interviewId]
      queryClient.setQueryData(
        ["interviews", interviewId],
        (old: Interview | undefined) => {
          if (!old) return interview;
          if (
            new Date(old.updatedAt || 0).getTime() >
            new Date(interview.updatedAt || 0).getTime()
          ) {
            return old;
          }
          return { ...old, ...interview };
        }
      );

      // 4. Invalidate applications list to keep applicant stage counts / statuses in sync
      void queryClient.invalidateQueries({ queryKey: ["applications"] });
    };

    socketInstance.on("interview:updated", handleInterviewUpdated);



    setSocket(socketInstance);

    const typingTimeouts = typingTimeoutsRef.current;

    return () => {
      socketInstance.removeAllListeners();
      socketInstance.disconnect();
      setSocket(null);
      setIsConnected(false);
      Object.values(typingTimeouts).forEach(clearTimeout);
    };
  }, [isAuthenticated, token, getBackendUrl, dispatch, queryClient, restoreActiveRooms, reconcilePersistentState]);

  // Room Subscription APIs
  const joinConversation = useCallback(
    (conversationId: string) => {
      if (!conversationId) return;
      activeConversationIdRef.current = conversationId;
      setActiveConversationId(conversationId);
      activeRoomsRef.current.add(`conversation_${conversationId}`);

      // Optimistically clear unread count for this conversation in cache
      let previousUnread = 0;
      queryClient.setQueriesData(
        { queryKey: ["conversations"] },
        (old: any) => {
          if (!old?.conversations) return old;
          return {
            ...old,
            conversations: old.conversations.map((c: any) => {
              if ((c._id || c.id) === conversationId) {
                if (c.unreadCount && c.unreadCount > 0) {
                  previousUnread = Math.max(previousUnread, c.unreadCount);
                }
                return {
                  ...c,
                  unreadCount: 0,
                };
              }
              return c;
            }),
          };
        }
      );

      // Decrement global unread count optimistically if previous unread count was present
      if (previousUnread > 0) {
        dispatch(decrementUnreadCount(previousUnread));
        queryClient.setQueryData(["unread-chat-count"], (prev: number | undefined) =>
          typeof prev === "number" ? Math.max(0, prev - previousUnread) : 0
        );
      }

      if (socket?.connected) {
        socket.emit("join_conversation", { conversationId });
        socket.emit("mark_read", { conversationId });
      }
    },
    [socket, queryClient, dispatch]
  );

  const leaveConversation = useCallback(
    (conversationId: string) => {
      if (!conversationId) return;
      if (activeConversationIdRef.current === conversationId) {
        activeConversationIdRef.current = null;
        setActiveConversationId(null);
      }
      activeRoomsRef.current.delete(`conversation_${conversationId}`);
      if (socket?.connected) {
        socket.emit("leave_conversation", { conversationId });
      }
    },
    [socket]
  );

  const joinAtsRecruiter = useCallback(() => {
    isAtsRecruiterJoinedRef.current = true;
    if (socket?.connected) {
      socket.emit("join_ats_recruiter");
    }
  }, [socket]);

  const joinAtsJob = useCallback(
    (jobId: string) => {
      if (!jobId) return;
      activeAtsJobIdRef.current = jobId;
      activeRoomsRef.current.add(`job_ats_${jobId}`);
      if (socket?.connected) {
        socket.emit("join_ats_job", { jobId });
      }
    },
    [socket]
  );

  const leaveAtsJob = useCallback(
    (jobId: string) => {
      if (!jobId) return;
      if (activeAtsJobIdRef.current === jobId) {
        activeAtsJobIdRef.current = null;
      }
      activeRoomsRef.current.delete(`job_ats_${jobId}`);
      if (socket?.connected) {
        socket.emit("leave_ats_job", { jobId });
      }
    },
    [socket]
  );

  return (
    <RealtimeContext.Provider
      value={{
        socket,
        isConnected,
        activeConversationId,
        joinConversation,
        leaveConversation,
        joinAtsRecruiter,
        joinAtsJob,
        leaveAtsJob,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (): RealtimeContextValue => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error("useRealtime must be used within a RealtimeProvider");
  }
  return context;
};
