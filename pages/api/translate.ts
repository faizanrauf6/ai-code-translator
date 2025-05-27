import type { NextApiRequest, NextApiResponse } from 'next';
import { TogetherTranslate } from '@/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { inputLanguage, outputLanguage, inputCode, model } = req.body;
    const translatedCode = await TogetherTranslate(inputLanguage, outputLanguage, inputCode, model);
    return res.status(200).json({ code: translatedCode });
  } catch (error: any) {
    console.error('API Handler Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal Server Error',
    });
  }
}
