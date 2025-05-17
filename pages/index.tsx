'use client';

import { useEffect, useState } from 'react';
import Head from 'next/head';
import toast from 'react-hot-toast';

import { APIKeyInput } from '@/components/APIKeyInput';
import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, TranslateBody } from '@/types/types';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem('apiKey', value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Output copied to clipboard!');
  };

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (!apiKey) return toast.error('Please enter an API key.');
    if (inputLanguage === outputLanguage)
      return toast.error('Select different input and output languages.');
    if (!inputCode) return toast.error('Please enter some code.');
    if (inputCode.length > maxCodeLength)
      return toast.error(
        `Code must be under ${maxCodeLength} characters. Current length: ${inputCode.length}`
      );

    setLoading(true);
    setOutputCode('');

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
      apiKey,
    };

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        setLoading(false);
        return toast.error('Something went wrong.');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let code = '';

      while (!done && reader) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        code += chunkValue;
        setOutputCode((prev) => prev + chunkValue);
      }

      setLoading(false);
      setHasTranslated(true);
      copyToClipboard(code);
    } catch (error) {
      setLoading(false);
      toast.error('Error connecting to translation service.');
    }
  };

  useEffect(() => {
    if (hasTranslated) handleTranslate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outputLanguage]);

  useEffect(() => {
    const storedKey = localStorage.getItem('apiKey');
    if (storedKey) setApiKey(storedKey);
  }, []);

  return (
    <>
      <Head>
        <title>Code Translator</title>
        <meta name="description" content="AI-powered code translator" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gray-950 px-4 py-10 text-white sm:px-10">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-center text-4xl font-bold text-white">AI Code Translator</h1>
          <p className="mt-2 text-center text-sm text-gray-400">
            Translate source code between programming languages using AI.
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ModelSelect model={model} onChange={setModel} />
            {/* <APIKeyInput apiKey={apiKey} onChange={handleApiKeyChange} /> */}
            <button
              className="rounded-lg bg-violet-600 px-6 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
              onClick={handleTranslate}
              disabled={loading}
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Input Panel */}
            <div className="space-y-3">
              <div className="text-lg font-semibold">Input</div>
              <LanguageSelect
                language={inputLanguage}
                onChange={(val) => {
                  setInputLanguage(val);
                  setHasTranslated(false);
                  setInputCode('');
                  setOutputCode('');
                }}
              />
              {inputLanguage === 'Natural Language' ? (
                <TextBlock
                  text={inputCode}
                  editable={!loading}
                  onChange={(val) => {
                    setInputCode(val);
                    setHasTranslated(false);
                  }}
                />
              ) : (
                <CodeBlock
                  code={inputCode}
                  editable={!loading}
                  onChange={(val) => {
                    setInputCode(val);
                    setHasTranslated(false);
                  }}
                />
              )}
            </div>

            {/* Output Panel */}
            <div className="space-y-3">
              <div className="text-lg font-semibold">Output</div>
              <LanguageSelect
                language={outputLanguage}
                onChange={(val) => {
                  setOutputLanguage(val);
                  setOutputCode('');
                }}
              />
              {outputLanguage === 'Natural Language' ? (
                <TextBlock text={outputCode} />
              ) : (
                <CodeBlock code={outputCode} />
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
