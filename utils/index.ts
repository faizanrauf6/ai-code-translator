export async function TogetherTranslate(
  inputLanguage: string,
  outputLanguage: string,
  inputCode: string,
  model: string,
): Promise<string> {
  // const prompt = `You are a code translator. Translate the following code written in ${inputLanguage} to ${outputLanguage} with full accuracy and no loss of variable names or content:\n\n${inputCode}`;
  const prompt = `You are a code translator. Translate the following code written in ${inputLanguage} to ${outputLanguage} with full accuracy and no loss of variable names or content. 
  IMPORTANT: Provide ONLY the translated code. Do NOT include any explanations, comments, or additional text.
  Here is the code to translate:
  ${inputCode}`;

  const response = await fetch('https://api.together.xyz/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      stream: false, // no streaming here
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Together API Error: ${errText}`);
  }

  const data = await response.json();

  // Extract content from choices array:
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('No content returned from Together API');
  }

  // Clean the content: remove ``` fences and language tags if any
  let cleaned = content.replace(/```(\w+)?\n?/g, '').replace(/```/g, '').trim();

  // Remove explanation block starting with "Explanation:" or similar
  // Assumes explanation is separated by two newlines or starts with Explanation:
  const explanationIndex = cleaned.search(/\n\nExplanation:/i);
  if (explanationIndex !== -1) {
    cleaned = cleaned.substring(0, explanationIndex).trim();
  }

  // Also handle if explanation starts on first line (just in case)
  if (/^Explanation:/i.test(cleaned)) {
    cleaned = '';
  }
  return cleaned;
}
