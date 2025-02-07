"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Conversation} from "@11labs/client";
import {cn} from "@/lib/utils";

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(): Promise<string> {
    const response = await fetch('/api/signed-url')
    if (!response.ok) {
        throw Error('Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

const ELEVEN_LABS_CONFIG = {
    apiKey: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
    voiceId: 'your_voice_id', // Replace with your chosen voice ID
}

export function ConvAI() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function startConversation() {
        try {
            const hasPermission = await requestMicrophonePermission()
            if (!hasPermission) {
                setError("Microphone permission is required")
                return
            }

            const signedUrl = await getSignedUrl()
            const conversation = await Conversation.startSession({
                signedUrl,
                apiKey: ELEVEN_LABS_CONFIG.apiKey,
                voiceId: ELEVEN_LABS_CONFIG.voiceId,
                onConnect: () => {
                    setIsConnected(true)
                    setIsSpeaking(true)
                },
                onDisconnect: () => {
                    setIsConnected(false)
                    setIsSpeaking(false)
                },
                onError: (error) => {
                    console.error('Conversation error:', error)
                    setError('An error occurred during the conversation')
                },
                onModeChange: ({mode}) => {
                    setIsSpeaking(mode === 'speaking')
                },
            })
            setConversation(conversation)
            setError(null)
        } catch (err) {
            console.error('Failed to start conversation:', err)
            setError('Failed to start conversation')
        }
    }

    async function endConversation() {
        if (!conversation) return
        try {
            await conversation.endSession()
            setConversation(null)
        } catch (err) {
            console.error('Failed to end conversation:', err)
            setError('Failed to end conversation')
        }
    }

    return (
        <div className="flex justify-center items-center w-full max-w-md mx-auto px-4">
            <Card className="rounded-3xl w-full">
                <CardContent className="p-4 sm:p-6">
                    <CardHeader className="p-0 sm:p-6">
                        <CardTitle className="text-center text-base sm:text-lg">
                            {isConnected ? (
                                isSpeaking ? `AI is speaking` : 'AI is listening'
                            ) : (
                                'Ready to chat'
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className="flex flex-col gap-y-4 text-center">
                        <div className={cn('orb my-8 sm:my-16 mx-6 sm:mx-12',
                            isSpeaking ? 'animate-orb' : (conversation && 'animate-orb-slow'),
                            isConnected ? 'orb-active' : 'orb-inactive')}
                        ></div>

                        {error && (
                            <div className="text-red-500 text-sm mb-4">
                                {error}
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="rounded-full text-sm sm:text-base"
                            size="lg"
                            disabled={conversation !== null && isConnected}
                            onClick={startConversation}
                        >
                            Start Voice Chat
                        </Button>
                        <Button
                            variant="outline"
                            className="rounded-full text-sm sm:text-base"
                            size="lg"
                            disabled={conversation === null && !isConnected}
                            onClick={endConversation}
                        >
                            End Voice Chat
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}