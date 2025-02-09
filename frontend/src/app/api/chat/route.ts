import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { message, context } = await request.json();

    // Create a system message with the context
    const systemMessage = `You are a knowledgeable assistant for Marp Trades, a trading platform on Starknet. 
    Use this context to answer questions:
    ${JSON.stringify(context, null, 2)}
    
    Always provide accurate, helpful responses based on this information. If you're unsure about something, say so rather than making assumptions.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return NextResponse.json({
      response: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from OpenAI' },
      { status: 500 }
    );
  }
} 