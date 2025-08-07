import { OpenAI } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Convert messages to OpenAI format with proper typing
    const openaiMessages: Array<{ role: 'user' | 'assistant'; content: string }> = messages.map((msg: any) => ({
      role: msg.author === 'User' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Add system message for Runix context
    const systemMessage = {
      role: 'system' as const,
      content: 'You are Runix AI, a helpful assistant for scientific research and development. You help users build, fix, and explore code, research ideas, and scientific concepts. Be concise, accurate, and helpful.',
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [systemMessage, ...openaiMessages],
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: {
        id: Date.now(),
        author: 'AI',
        content: assistantMessage,
      },
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
