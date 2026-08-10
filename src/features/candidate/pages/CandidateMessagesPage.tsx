import { useState, useEffect } from "react";

import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/store/store";
import {
  useConversations,
  useMessages,
  useCreateConversation,
} from "@/features/chat/hooks/useChat";
import { useChatSocket } from "@/features/chat/hooks/useChatSocket";
import ConversationSidebar from "@/features/chat/components/ConversationSidebar";
import ChatWindow from "@/features/chat/components/ChatWindow";

export default function CandidateMessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConvId = searchParams.get("conversationId");
  const jobIdParam = searchParams.get("jobId");

  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConvId);

  const { user } = useSelector((state: RootState) => state.auth);
  const { onlineUsers, typingUsersByConversation } = useSelector(
    (state: RootState) => state.chat
  );

  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const conversations = conversationsData?.conversations || [];

  const createConversation = useCreateConversation();

  // If jobId param provided in URL, create or get conversation
  useEffect(() => {
    if (jobIdParam && user) {
      createConversation.mutate(
        { jobId: jobIdParam },
        {
          onSuccess: (conv) => {
            setActiveConversationId(conv._id);
            setSearchParams({ conversationId: conv._id });
          },
        }
      );
    }
  }, [jobIdParam]);

  // Select first conversation if none selected
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && !jobIdParam) {
      setActiveConversationId(conversations[0]._id);
    }
  }, [conversations, activeConversationId, jobIdParam]);

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(activeConversationId);
  const messages = messagesData?.messages || [];

  const { sendMessage, startTyping, stopTyping } = useChatSocket(activeConversationId);

  const activeConversation =
    conversations.find((c) => c._id === activeConversationId) || null;

  const currentTypingUsers = activeConversationId
    ? typingUsersByConversation[activeConversationId] || []
    : [];

  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId);
    setSearchParams({ conversationId: convId });
  };

  const handleSendMessage = (
    messageText: string,
    messageType = "text",
    attachments: Record<string, unknown>[] = []
  ) => {

    if (!activeConversationId) return;
    sendMessage(activeConversationId, messageText, messageType, attachments as any);

  };

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Sidebar - Conversation List */}
      <div className="w-full sm:w-80 md:w-96 shrink-0 h-full">
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={user?.id || ""}
          onlineUserIds={onlineUsers}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoadingConversations}
        />
      </div>

      {/* Main Chat Window */}
      <div className="hidden sm:flex flex-1 h-full">
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          currentUserId={user?.id || ""}
          onlineUserIds={onlineUsers}
          typingUsers={currentTypingUsers}
          onSendMessage={handleSendMessage}
          onTypingStart={() => activeConversationId && startTyping(activeConversationId)}
          onTypingStop={() => activeConversationId && stopTyping(activeConversationId)}
          isLoadingMessages={isLoadingMessages}
        />
      </div>
    </div>
  );
}
