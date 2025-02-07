declare module '@11labs/client' {
  export class Conversation {
    static startSession(config: {
      signedUrl: string
      apiKey?: string
      voiceId?: string
      onConnect?: () => void
      onDisconnect?: () => void
      onError?: (error: any) => void
      onModeChange?: (data: { mode: 'speaking' | 'listening' }) => void
    }): Promise<Conversation>

    endSession(): Promise<void>
  }
} 