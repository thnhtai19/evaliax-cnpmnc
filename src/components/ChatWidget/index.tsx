import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEmployeeChat } from "./api";
import { useAuth } from "@/hooks/useAuthContext";
import type { ChatMessage } from "@/models/chatwidget.type";

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "assistant",
    senderName: "Chat Bot AI",
    content: "Xin chào! Tôi có thể hỗ trợ gì cho bạn hôm nay?",
    time: new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const STORAGE_KEY = "chat_widget_user_messages";
  const [userMessages, setUserMessages] = useState<ChatMessage[]>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed: ChatMessage[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((m) => ({ ...m, isTyping: false }));
      }
      return [];
    } catch {
      return [];
    }
  });
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const { mutateAsync: sendEmployeeChatMessage, isPending: isSendingMessage } = useEmployeeChat();
  const { user } = useAuth();

  

  const messages = useMemo(() => {
    return [...DEFAULT_MESSAGES, ...userMessages];
  }, [userMessages]);

  const toggleOpen = () => setIsOpen((prev) => !prev);

  const TypingDots = () => (
    <span className="inline-flex items-center gap-1 align-middle">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-500/70 animate-bounce [animation-delay:-0.3s]"></span>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-500/70 animate-bounce [animation-delay:-0.15s]"></span>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-gray-500/70 animate-bounce"></span>
    </span>
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const createdAt = new Date();

    const time = createdAt.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const userMessageId = Date.now();
    const placeholderId = userMessageId + 1;

    setUserMessages((prev) => [
      ...prev,
      {
        id: userMessageId,
        sender: "user",
        senderName: user?.name || "Bạn",
        content: trimmed,
        time,
      },
      {
        id: placeholderId,
        sender: "assistant",
        senderName: "Chat Bot AI",
        content: "",
        time,
        isTyping: true,
      },
    ]);

    setInputValue("");

    sendEmployeeChatMessage({ message: trimmed, role: user?.role })
      .then((response) => {
        const replyTime = new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setUserMessages((prev) =>
          prev.map((message) =>
            message.id === placeholderId
              ? {
                  ...message,
                  content: response?.reply ?? "Hiện chưa có câu trả lời phù hợp.",
                  time: replyTime,
                  isTyping: false,
                }
              : message,
          ),
        );
      })
      .catch((error) => {
        const replyTime = new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });

        setUserMessages((prev) =>
          prev.map((message) =>
            message.id === placeholderId
              ? {
                  ...message,
                  content: "Xin lỗi, hệ thống đang gặp sự cố. Vui lòng thử lại sau.",
                  time: replyTime,
                  isTyping: false,
                }
              : message,
          ),
        );

        console.error("sendEmployeeChatMessage failed", error);
      });
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userMessages));
    } catch (error) {
      console.error("Failed to save chat messages to sessionStorage", error);
    }
  }, [userMessages]);

  useEffect(() => {
    if (!isOpen) return;
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="flex h-[500px] w-80 flex-col border border-gray-200 bg-white shadow-2xl ring-1 ring-black/5 rounded-2xl">
          <header className="flex items-start justify-between gap-3 border-b border-gray-100 bg-blue-50 px-4 py-3 rounded-t-2xl">
            <div>
              <p className="text-sm font-semibold text-gray-900">Chat Bot AI</p>
              <p className="text-xs text-gray-600">
                Hỗ trợ truy suất thông tin từ hệ thống.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleOpen}
              className="inline-flex size-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-white hover:text-gray-700"
              aria-label="Đóng hộp chat"
            >
              <X className="size-4" />
            </button>
          </header>

          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex", {
                  "justify-end": message.sender === "user",
                  "justify-start": message.sender === "assistant",
                })}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-3 py-2 leading-relaxed",
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-800"
                  )}
                >
                  <p className="mb-1 text-xs font-semibold opacity-80">
                    {message.senderName} · {message.time}
                  </p>
                  {message.isTyping ? (
                    <p className="whitespace-pre-wrap text-sm">
                      <TypingDots />
                    </p>
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-gray-100 bg-white px-4 py-3 rounded-b-2xl"
          >

            <textarea
              id="chat-widget-input"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              rows={2}
              placeholder="Nhập tin nhắn..."
              className="w-full resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSendingMessage}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  if (!isSendingMessage) {
                    formRef.current?.requestSubmit();
                  }
                }
              }}
            />
            <button
              type="submit"
              className="cursor-pointer inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-blue-600 text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
              aria-label="Gửi tin nhắn"
              disabled={isSendingMessage}
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}


      <button
        type="button"
        onClick={toggleOpen}
        className="min-w-36 cursor-pointer justify-center inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 focus-visible:ring-offset-2"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="size-4" /> : <MessageCircle className="size-4" />}
        <span>{isOpen ? "Đóng chat" : "Chat hỗ trợ"}</span>
      </button>
    </div>
  );
}

export default ChatWidget;
