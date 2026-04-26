import { SendHorizonal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios.js";
import Alert from "../components/ui/Alert.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Loader from "../components/ui/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import {
  formatCurrency,
  formatDate,
  getApiErrorMessage,
  getImageSrc,
  getInitials
} from "../utils/formatters.js";

export default function ChatPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const seedProductId = searchParams.get("productId");
  const seedParticipantId = searchParams.get("participantId");

  const currentParticipantId = useMemo(
    () => selectedThread?.otherUser?._id || selectedThread?.participantId,
    [selectedThread]
  );

  const loadConversations = async () => {
    const { data } = await api.get("/messages/conversations");
    setConversations(data.conversations || []);
    return data.conversations || [];
  };

  const loadThread = async (thread) => {
    if (!thread?.product?._id || !thread?.participantId) {
      return;
    }

    setThreadLoading(true);

    try {
      const { data } = await api.get(
        `/messages/thread/${thread.product._id}/${thread.participantId}`
      );
      setMessages(data.messages || []);
      await api.patch(`/messages/thread/${thread.product._id}/${thread.participantId}/read`);
    } catch (threadError) {
      setError(getApiErrorMessage(threadError, "Unable to load messages."));
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;

    const bootstrapChat = async () => {
      setLoading(true);
      setError("");

      try {
        const conversationList = await loadConversations();

        if (seedProductId && seedParticipantId) {
          const existing = conversationList.find(
            (conversation) =>
              conversation.product?._id === seedProductId &&
              conversation.otherUser?._id === seedParticipantId
          );

          if (existing) {
            setSelectedThread({
              ...existing,
              participantId: existing.otherUser._id
            });
          } else {
            const { data } = await api.get(`/products/${seedProductId}`);
            setSelectedThread({
              product: data.product,
              otherUser: data.product.seller,
              participantId: seedParticipantId
            });
          }
        } else if (conversationList.length) {
          const firstConversation = conversationList[0];
          setSelectedThread({
            ...firstConversation,
            participantId: firstConversation.otherUser._id
          });
        }
      } catch (chatError) {
        setError(getApiErrorMessage(chatError, "Unable to load conversations."));
      } finally {
        setLoading(false);
      }

      intervalId = window.setInterval(() => {
        loadConversations().catch(() => undefined);
      }, 8000);
    };

    bootstrapChat();

    return () => window.clearInterval(intervalId);
  }, [seedParticipantId, seedProductId]);

  useEffect(() => {
    if (!selectedThread) {
      return undefined;
    }

    loadThread(selectedThread);
    const intervalId = window.setInterval(() => loadThread(selectedThread), 6000);

    return () => window.clearInterval(intervalId);
  }, [selectedThread]);

  const handleSend = async (event) => {
    event.preventDefault();

    if (!draft.trim() || !selectedThread) {
      return;
    }

    setSending(true);

    try {
      await api.post(
        `/messages/thread/${selectedThread.product._id}/${selectedThread.participantId}`,
        { body: draft }
      );
      setDraft("");
      await loadThread(selectedThread);
      await loadConversations();
    } catch (sendError) {
      setError(getApiErrorMessage(sendError, "Unable to send message."));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <Loader fullScreen label="Loading conversations..." />;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.38fr_0.62fr]">
      <aside className="surface-card space-y-4 px-5 py-6">
        <div>
          <p className="pill">Inbox</p>
          <h1 className="mt-3 text-2xl font-bold text-ink">Campus conversations</h1>
          <p className="mt-2 text-sm text-slate-500">
            Chat with buyers and sellers to coordinate pickup, payment, and trust.
          </p>
        </div>

        {error ? <Alert>{error}</Alert> : null}

        <div className="space-y-3">
          {conversations.length ? (
            conversations.map((conversation) => {
              const active =
                selectedThread?.product?._id === conversation.product?._id &&
                currentParticipantId === conversation.otherUser?._id;

              return (
                <button
                  className={`w-full rounded-3xl border p-4 text-left transition ${
                    active
                      ? "border-ink bg-slate-900 text-white"
                      : "border-slate-100 bg-white hover:border-accent"
                  }`}
                  key={conversation.key}
                  onClick={() =>
                    setSelectedThread({
                      ...conversation,
                      participantId: conversation.otherUser._id
                    })
                  }
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <img
                      alt={conversation.product?.title}
                      className="h-14 w-14 rounded-2xl object-cover"
                      src={getImageSrc(conversation.product?.images?.[0])}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{conversation.product?.title}</p>
                      <p className={`truncate text-xs ${active ? "text-slate-300" : "text-slate-500"}`}>
                        {conversation.otherUser?.name}
                      </p>
                    </div>
                    {conversation.unreadCount ? (
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                        active ? "bg-white/10 text-white" : "bg-orange-100 text-orange-700"
                      }`}>
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <p className={`mt-3 line-clamp-2 text-sm ${active ? "text-slate-200" : "text-slate-500"}`}>
                    {conversation.latestMessage?.body}
                  </p>
                </button>
              );
            })
          ) : (
            <EmptyState
              action={<Link className="btn-secondary" to="/marketplace">Browse Listings</Link>}
              description="Start from any listing and tap Message Seller to open your first conversation."
              title="No conversations yet"
            />
          )}
        </div>
      </aside>

      <section className="surface-card flex min-h-[42rem] flex-col px-5 py-6">
        {selectedThread ? (
          <>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <img
                  alt={selectedThread.product?.title}
                  className="h-16 w-16 rounded-3xl object-cover"
                  src={getImageSrc(selectedThread.product?.images?.[0])}
                />
                <div>
                  <h2 className="text-xl font-bold text-ink">{selectedThread.product?.title}</h2>
                  <p className="text-sm text-slate-500">
                    {selectedThread.otherUser?.name || "Conversation partner"} | {formatCurrency(selectedThread.product?.price)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto py-5">
              {threadLoading ? (
                <Loader label="Refreshing messages..." />
              ) : messages.length ? (
                messages.map((message) => {
                  const mine = message.sender?._id === user._id;
                  return (
                    <div
                      className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      key={message._id}
                    >
                      <div
                        className={`max-w-xl rounded-3xl px-4 py-3 ${
                          mine ? "bg-ink text-white" : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        <p className="text-sm leading-6">{message.body}</p>
                        <p className={`mt-2 text-xs ${mine ? "text-slate-300" : "text-slate-500"}`}>
                          {formatDate(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="max-w-md text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-lg font-bold text-slate-700">
                      {getInitials(selectedThread.otherUser?.name)}
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-ink">Start the conversation</h3>
                    <p className="mt-2 text-sm text-slate-500">
                      Ask about availability, condition, pickup timing, or price.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <form className="border-t border-slate-100 pt-5" onSubmit={handleSend}>
              <div className="flex gap-3">
                <textarea
                  className="input-field min-h-24 flex-1"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Write your message..."
                  value={draft}
                />
                <button className="btn-primary h-fit" disabled={sending} type="submit">
                  <SendHorizonal className="mr-2" size={16} />
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <EmptyState
            action={<Link className="btn-secondary" to="/marketplace">Browse Listings</Link>}
            description="Choose a conversation from the left, or message a seller from a product detail page."
            title="Select a conversation"
          />
        )}
      </section>
    </div>
  );
}
