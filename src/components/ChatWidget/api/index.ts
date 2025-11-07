import { useMutation } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type { EmployeeChatRequest, EmployeeChatResponse } from "@/models/chatwidget.type";

export async function sendEmployeeChatMessage({ message, role }: EmployeeChatRequest) {
  const path = role === "EMPLOYEE" ? "/ai/employee/chat" : "/ai/chat";
  const response = await apiClient.post<{ data: EmployeeChatResponse }>(
    path,
    { message },
  );

  return response.data.data;
}

export function useEmployeeChat() {
  return useMutation({
    mutationKey: ["employee-chat"],
    mutationFn: sendEmployeeChatMessage,
  });
}

