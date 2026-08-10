import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import type { RootState } from "@/app/store/store";
import useAuth from "@/features/auth/hooks/useAuth";
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
  const [showMobileChat, setShowMobileChat] = useState<boolean>(Boolean(initialConvId));

  // Track if we've already auto-created a conversation for this jobId
  // to prevent the mutate firing again on re-renders
  const creatingForJobId = useRef<string | null>(null);

  const { user } = useAuth();
  const currentUserId = user?.id || (user as any)?._id || "";

  const { onlineUsers, typingUsersByConversation } = useSelector(
    (state: RootState) => state.chat
  );

  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const conversations = conversationsData?.conversations || [];

  const createConversation = useCreateConversation();

  // If jobId param is in URL, create/get a conversation for it.
  // Guard prevents duplicate calls on re-render.
  useEffect(() => {
    if (!jobIdParam || !user) return;
    if (creatingForJobId.current === jobIdParam) return; // already in flight
    creatingForJobId.current = jobIdParam;

    createConversation.mutate(
      { jobId: jobIdParam },
      {
        onSuccess: (conv) => {
          const id = conv._id || conv.id || "";
          setActiveConversationId(id);
          setShowMobileChat(true);
          // Replace jobId with conversationId so a page refresh lands directly
          setSearchParams({ conversationId: id }, { replace: true });
        },
        onError: (err) => {
          console.error("Failed to initialize conversation from jobId:", err);
          creatingForJobId.current = null; // allow retry on next render if desired
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobIdParam, user]);

  // Auto-select first conversation on desktop when none is active
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0 && !jobIdParam) {
      const firstId = conversations[0]._id || conversations[0].id || "";
      setActiveConversationId(firstId);
    }
  }, [conversations, activeConversationId, jobIdParam]);

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(activeConversationId);
  const messages = messagesData?.messages || [];

  const { sendMessage, editMessage, deleteMessage, startTyping, stopTyping } = useChatSocket(activeConversationId);

  const activeConversation =
    conversations.find((c) => (c._id || c.id) === activeConversationId) || null;

  const currentTypingUsers = activeConversationId
    ? typingUsersByConversation[activeConversationId] || []
    : [];

  const handleSelectConversation = (convId: string) => {
    setActiveConversationId(convId);
    setShowMobileChat(true);
    setSearchParams({ conversationId: convId }, { replace: true });
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
      {/* Sidebar */}
      <div
        className={`w-full sm:w-80 md:w-96 shrink-0 h-full ${
          showMobileChat ? "hidden sm:block" : "block"
        }`}
      >
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          currentUserId={currentUserId}
          onlineUserIds={onlineUsers}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoadingConversations}
          userRole="candidate"
        />
      </div>

      {/* Chat window */}
      <div
        className={`flex-1 h-full ${
          showMobileChat ? "flex" : "hidden sm:flex"
        }`}
      >
        <ChatWindow
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          onlineUserIds={onlineUsers}
          typingUsers={currentTypingUsers}
          onSendMessage={handleSendMessage}
          onEditMessage={(msgId, newText) => activeConversationId && editMessage(activeConversationId, msgId, newText)}
          onDeleteMessage={(msgId, forEveryone) => activeConversationId && deleteMessage(activeConversationId, msgId, forEveryone)}
          onTypingStart={() => activeConversationId && startTyping(activeConversationId)}
          onTypingStop={() => activeConversationId && stopTyping(activeConversationId)}
          isLoadingMessages={isLoadingMessages}
          onBackToSidebar={() => setShowMobileChat(false)}
        />
      </div>
    </div>
  );
}
