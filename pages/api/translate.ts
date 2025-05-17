import { TranslateBody } from '@/types/types';
import { OpenAIStream } from '@/utils';

export const config = {
  runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
  try {
    const { inputLanguage, outputLanguage, inputCode, model, apiKey } =
      (await req.json()) as TranslateBody;

    console.log({ inputLanguage, outputLanguage, model, apiKeyExists: !!apiKey });

    const stream = await OpenAIStream(
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    );

    return new Response(stream);
  } catch (error) {
    console.error('Handler Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};


export default handler;
