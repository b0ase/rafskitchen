import { NextResponse } from 'next/server';

const BASE_URL = 'https://api.aimlapi.com/v1';

export async function POST(request: Request) {
  try {
    console.log('API Key:', process.env.AIML_API_KEY?.substring(0, 5) + '...');
    const { message } = await request.json();
    console.log('1. Received message:', message);
    console.log('2. API Key present:', !!process.env.AIML_API_KEY);

    if (!process.env.AIML_API_KEY) {
      throw new Error('AIML_API_KEY is not configured');
    }

    const payload = {
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 256
    };

    const url = `${BASE_URL}/chat/completions?key=${process.env.AIML_API_KEY}`;
    console.log('3. Request URL:', url);
    console.log('4. Request payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('5. Response status:', response.status);
    const responseText = await response.text();
    console.log('6. Response body:', responseText);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}\n${responseText}`);
    }

    const data = JSON.parse(responseText);
    return NextResponse.json({ message: data.choices[0].message.content });

  } catch (error: any) {
    console.error('Error details:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process request',
      type: 'request_error'
    }, { status: 500 });
  }
} 