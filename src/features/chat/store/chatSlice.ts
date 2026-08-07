import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


interface ChatState {
  activeConversationId: string | null;
  onlineUsers: string[];
  typingUsersByConversation: Record<string, string[]>;
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
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) {
      const { conversationId, userId } = action.payload;
      const current = state.typingUsersByConversation[conversationId] || [];
      if (!current.includes(userId)) {
        state.typingUsersByConversation[conversationId] = [...current, userId];
      }
    },

    setUserStopTyping(
      state,
      action: PayloadAction<{ conversationId: string; userId: string }>
    ) {
      const { conversationId, userId } = action.payload;
      const current = state.typingUsersByConversation[conversationId] || [];
      state.typingUsersByConversation[conversationId] = current.filter(
        (id) => id !== userId
      );
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
  setUnreadTotalCount,
  incrementUnreadCount,
  decrementUnreadCount,
} = chatSlice.actions;

export default chatSlice.reducer;
