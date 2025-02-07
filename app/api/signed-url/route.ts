import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voice-generation/generate-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVEN_LABS_API_KEY!
      },
      body: JSON.stringify({
        model_id: 'eleven_monolingual_v1',
        voice_id: 'your_voice_id', // Replace with your chosen voice ID
        text: 'Hello! I am your AI trading assistant.'
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate signed URL')
    }

    const data = await response.json()
    return NextResponse.json({ signedUrl: data.url })
  } catch (error) {
    console.error('Error generating signed URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    )
  }
} 