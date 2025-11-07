export type EmployeeChatRequest = {
    message: string;
    role?: string | null;
};

export type EmployeeChatResponse = {
    reply: string;
    suggestedActions: string[];
    relevantData?: string;
}

export type SenderType = "user" | "assistant";

export type ChatMessage = {
  id: number;
  sender: SenderType;
  senderName: string;
  content: string;
  time: string;
  isTyping?: boolean;
};