import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface TypingUserEntry {
  userId: string;
  userName?: string;
}

interface ChatState {
  activeConversationId: string | null;
  onlineUsers: string[];
  typingUsersByConversation: Record<string, TypingUserEntry[]>;
  unreadTotalCount: number;
}

const initialState: ChatState = {
  activeConversationId: null,
  onlineUsers: [],
  typingUsersByConversation: {},
  unreadTotalCount: 0,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversationId(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },

    setOnlineUsers(state, action: PayloadAction<string[]>) {
      state.onlineUsers = action.payload;
    },

    setUserTyping(
      state,
      action: PayloadAction<{ conversationId: string; userId: string; userName?: string }>
    ) {
      const { conversationId, userId, userName } = action.payload;
      const current = state.typingUsersByConversation[conversationId] || [];
      const exists = current.some((item) => item.userId === userId);
      if (!exists) {
        state.typingUsersByConversation[conversationId] = [
          ...current,
          { userId, userName: userName || "User" },
        ];
      } else {
        // Update userName if provided
        state.typingUsersByConversation[conversationId] = current.map((item) =>
          item.userId === userId ? { ...item, userName: userName || item.userName } : item
        );
      }
    },

    setUserStopTyping(
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) {
      const { conversationId, userId } = action.payload;
      const current = state.typingUsersByConversation[conversationId] || [];
      state.typingUsersByConversation[conversationId] = current.filter(
        (item) => item.userId !== userId
      );
    },

    clearAllTypingForConversation(state, action: PayloadAction<string>) {
      delete state.typingUsersByConversation[action.payload];
    },

    setUnreadTotalCount(state, action: PayloadAction<number>) {
      state.unreadTotalCount = action.payload;
    },

    incrementUnreadCount(state) {
      state.unreadTotalCount += 1;
    },

    decrementUnreadCount(state, action: PayloadAction<number | undefined>) {
      const amount = action.payload ?? 1;
      state.unreadTotalCount = Math.max(0, state.unreadTotalCount - amount);
    },
  },
});

export const {
  setActiveConversationId,
  setOnlineUsers,
  setUserTyping,
  setUserStopTyping,
  clearAllTypingForConversation,
  setUnreadTotalCount,
  incrementUnreadCount,
  decrementUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
