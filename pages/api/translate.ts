// pages/api/translate.ts
 import { OpenAIStream } from '@/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputLanguage, outputLanguage, inputCode, model } = req.body;

    const stream = await OpenAIStream(inputLanguage, outputLanguage, inputCode, model);
    if (!stream) {
      return res.status(500).json({ error: 'Stream initialization failed' });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
    });

    stream.pipeTo(new WritableStream({
      write(chunk) {
        res.write(chunk);
      },
      close() {
        res.end();
      },
      abort(err) {
        console.error('Stream aborted', err);
        res.end();
      },
    }));
  } catch (error: any) {
    console.error('API Handler Error:', error);
    res.status(500).json({
      error: error.message || 'Internal Server Error',
    });
  }
}
