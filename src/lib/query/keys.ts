export const queryKeys = {
  conversations: (userId: string) => ["conversations", userId] as const,
  messages: (userId: string, conversationId: string) =>
    ["messages", userId, conversationId] as const,
  messagesPrefix: (userId: string) => ["messages", userId] as const,
  userSearch: (query: string) => ["users", "search", query] as const,
}
