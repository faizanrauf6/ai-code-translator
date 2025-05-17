// This file contains utility functions for handling OpenAI API requests and responses.
export async function OpenAIStream(
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
  model: string,
) {
  const prompt = `Translate the following code from ${inputLanguage} to ${outputLanguage}:\n\n${inputCode}`;

  try {
    const response = await fetch(`${process.env.OPENAI_API_HOST}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('OpenAI API Error:', errText); // 🔥 will help you find real reason
      throw new Error(errText);
    }

    return response.body;
  } catch (error) {
    console.error('OpenAIStream error:', error);
    throw error;
  }
}

