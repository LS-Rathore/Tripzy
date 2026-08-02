interface ChatMessage {
    role: 'user' | 'model';
    parts: {
        text: string;
    }[];
}
export declare const generateLocalFriendResponse: (message: string, history: ChatMessage[], tripContext: any, activeDay: number) => Promise<string>;
export {};
//# sourceMappingURL=aiChatService.d.ts.map