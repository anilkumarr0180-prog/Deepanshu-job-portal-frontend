import { useState, useEffect, useRef, useMemo } from "react";
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
import type { ChatConversation } from "@/features/chat/types/chat.types";
import { getUserIdString } from "@/features/chat/types/chat.types";

import { UserProfileProvider } from "@/features/posts/context/UserProfileContext";
import UserProfileDrawer from "@/features/posts/components/UserProfileDrawer";

function RecruiterMessagesContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialConvId = searchParams.get("conversationId");
  const jobIdParam = searchParams.get("jobId");
  const userIdParam = searchParams.get("userId") || searchParams.get("targetUserId") || searchParams.get("applicantId");
  const nameParam = searchParams.get("name");
  const roleParam = searchParams.get("role");
  const avatarParam = searchParams.get("avatar");

  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConvId);
  const [showMobileChat, setShowMobileChat] = useState<boolean>(Boolean(initialConvId || userIdParam));
  const [draftConversation, setDraftConversation] = useState<ChatConversation | null>(null);

  const creationAttemptedRef = useRef<string | null>(null);

  const { user } = useAuth();
  const currentUserId = user?.id || (user as any)?._id || "";

  const { onlineUsers, typingUsersByConversation } = useSelector(
    (state: RootState) => state.chat
  );

  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const conversations = conversationsData?.conversations || [];

  const createConversation = useCreateConversation();

  // Handle URL query parameters (userId or jobId) to initialize conversation
  useEffect(() => {
    if (!user || isLoadingConversations) return;

    if (userIdParam || jobIdParam) {
      const initKey = `${userIdParam || ""}_${jobIdParam || ""}`;

      // Check if existing conversation is already loaded
      const existingConv = conversations.find((c) => {
        const candId = getUserIdString(c.candidateId);
        const recId = getUserIdString(c.recruiterId);
        const matchesUser = userIdParam ? candId === userIdParam || recId === userIdParam : true;
        const matchesJob = jobIdParam ? ((c.jobId as any)?._id || (c.jobId as any)?.id || c.jobId) === jobIdParam : true;
        return matchesUser && matchesJob;
      });

      if (existingConv) {
        const id = existingConv._id || existingConv.id || "";
        setActiveConversationId(id);
        setShowMobileChat(true);
        setDraftConversation(null);
        setSearchParams({ conversationId: id }, { replace: true });
        return;
      }

      // If not found in list, attempt creation or prepare draft
      if (creationAttemptedRef.current === initKey) return;
      creationAttemptedRef.current = initKey;

      createConversation.mutate(
        {
          jobId: jobIdParam || undefined,
          targetUserId: userIdParam || undefined,
        },
        {
          onSuccess: (conv) => {
            const id = conv._id || conv.id || "";
            setActiveConversationId(id);
            setShowMobileChat(true);
            setDraftConversation(null);
            setSearchParams({ conversationId: id }, { replace: true });
          },
          onError: () => {
            if (userIdParam) {
              const draft: ChatConversation = {
                _id: `draft_${userIdParam}`,
                recruiterId: {
                  _id: currentUserId,
                  name: user.name || "Me",
                  email: user.email || "",
                  role: "recruiter",
                  profilePicture: (user as any).profilePicture,
                },
                candidateId: {
                  _id: userIdParam,
                  name: nameParam || "Candidate",
                  email: "",
                  role: (roleParam as any) || "candidate",
                  profilePicture: avatarParam || undefined,
                },
                jobId: jobIdParam ? ({ _id: jobIdParam, title: "Direct Discussion" } as any) : undefined,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setDraftConversation(draft);
              setActiveConversationId(`draft_${userIdParam}`);
              setShowMobileChat(true);
            }
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdParam, jobIdParam, user, isLoadingConversations, conversations]);

  // Combine draft conversation with conversation list
  const allConversations = useMemo(() => {
    if (draftConversation && !conversations.some((c) => (c._id || c.id) === draftConversation._id)) {
      return [draftConversation, ...conversations];
    }
    return conversations;
  }, [conversations, draftConversation]);

  const activeConversation = useMemo(() => {
    if (draftConversation && activeConversationId === draftConversation._id) {
      return draftConversation;
    }
    return allConversations.find((c) => (c._id || c.id) === activeConversationId) || null;
  }, [allConversations, activeConversationId, draftConversation]);



  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowMobileChat(true);
    setSearchParams({ conversationId });
  };

  const isRealConversationId = Boolean(activeConversationId && !activeConversationId.startsWith("draft_"));

  const { data: messagesData, isLoading: isLoadingMessages } = useMessages(
    isRealConversationId ? activeConversationId : null
  );
  const messages = isRealConversationId ? (messagesData?.messages || []) : [];

  const { sendMessage, editMessage, deleteMessage, startTyping, stopTyping } = useChatSocket(
    isRealConversationId ? activeConversationId : null
  );

  const currentTypingUsers = activeConversationId
    ? typingUsersByConversation[activeConversationId] || []
    : [];

  const handleSendMessage = async (
    messageText: string,
    messageType: string = "text",
    attachments: any[] = []
  ) => {
    if (!activeConversationId) return;

    // If sending from a draft conversation, trigger real backend creation first
    if (activeConversationId.startsWith("draft_")) {
      try {
        const newConv = await createConversation.mutateAsync({
          jobId: jobIdParam || undefined,
          targetUserId: userIdParam || undefined,
        });
        const realId = newConv._id || newConv.id || "";
        setActiveConversationId(realId);
        setDraftConversation(null);
        setSearchParams({ conversationId: realId }, { replace: true });
        sendMessage(realId, messageText, messageType, attachments as any);
      } catch (err) {
        console.error("Failed to create conversation:", err);
      }
      return;
    }

    sendMessage(activeConversationId, messageText, messageType, attachments as any);
  };

  const handleDeleteConversation = (convId: string) => {
    if (activeConversationId === convId) {
      setActiveConversationId(null);
      setShowMobileChat(false);
      setSearchParams({}, { replace: true });
    }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      {/* Sidebar - Conversation List */}
      <div
        className={`w-full sm:w-80 md:w-96 shrink-0 h-full ${
          showMobileChat ? "hidden sm:block" : "block"
        }`}
      >
        <ConversationSidebar
          conversations={allConversations}
          activeConversationId={activeConversationId}
          currentUserId={currentUserId}
          onlineUserIds={onlineUsers}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoadingConversations}
          userRole="recruiter"
        />
      </div>

      {/* Main Chat Window */}
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
          onEditMessage={(msgId, newText) => activeConversationId && isRealConversationId && editMessage(activeConversationId, msgId, newText)}
          onDeleteMessage={(msgId, forEveryone) => activeConversationId && isRealConversationId && deleteMessage(activeConversationId, msgId, forEveryone)}
          onDeleteConversation={handleDeleteConversation}
          onTypingStart={() => activeConversationId && isRealConversationId && startTyping(activeConversationId)}
          onTypingStop={() => activeConversationId && isRealConversationId && stopTyping(activeConversationId)}
          isLoadingMessages={isRealConversationId ? isLoadingMessages : false}
          onBackToSidebar={() => setShowMobileChat(false)}
        />
      </div>
    </div>
  );
}

export default function RecruiterMessagesPage() {
  return (
    <UserProfileProvider>
      <RecruiterMessagesContent />
      <UserProfileDrawer />
    </UserProfileProvider>
  );
}
