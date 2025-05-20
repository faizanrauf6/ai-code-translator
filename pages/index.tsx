import { CodeBlock } from '@/components/CodeBlock';
import { LanguageSelect } from '@/components/LanguageSelect';
import { ModelSelect } from '@/components/ModelSelect';
import { TextBlock } from '@/components/TextBlock';
import { OpenAIModel, TranslateBody } from '@/types/types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState<string>('JavaScript');
  const [outputLanguage, setOutputLanguage] = useState<string>('Python');
  const [inputCode, setInputCode] = useState<string>('');
  const [outputCode, setOutputCode] = useState<string>('');
  const [model, setModel] = useState<OpenAIModel>('gpt-3.5-turbo');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasTranslated, setHasTranslated] = useState<boolean>(false);

  const handleTranslate = async () => {
    const maxCodeLength = model === 'gpt-3.5-turbo' ? 6000 : 12000;

    if (inputLanguage === outputLanguage) {
      toast.error('Please select different languages.');
      return;
    }

    if (!inputCode) {
      toast.error('Please enter some code.');
      return;
    }

    if (inputCode.length > maxCodeLength) {
      toast.error(`Please enter code less than ${maxCodeLength} characters.`);
      return;
    }

    setLoading(true);
    setOutputCode('');

    const controller = new AbortController();

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
    };

    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      setLoading(false);
      try {
        const errorText = await response.text();
        // Try to parse double-encoded JSON
        let errorMessage = 'Unknown error occurred.';
        try {
          const outer = JSON.parse(errorText);
          if (outer.error) {
            const inner = JSON.parse(outer.error);
            errorMessage = inner.error?.message || errorText;
          } else {
            errorMessage = outer.message || errorText;
          }
        } catch {
          errorMessage = errorText;
        }

        console.error('API Error:', errorMessage);
        toast.custom((t) => (
          <div
            className={`max-w-md w-full bg-white text-black p-4 rounded shadow-lg ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
          >
            <p className="font-bold">API Error</p>
            <pre className="text-sm whitespace-pre-wrap">{errorMessage}</pre>
          </div>
        ));
      } catch (e) {
        toast.error('Something went wrong while parsing error.');
      }
      return;
    }

    const data = response.body;
    if (!data) {
      setLoading(false);
      toast.error('Something went wrong.');
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let code = '';

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      code += chunkValue;
      setOutputCode((prev) => prev + chunkValue);
    }

    setLoading(false);
    setHasTranslated(true);
    copyToClipboard(code);
    toast.success('Output copied to clipboard!');
  };

  const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  useEffect(() => {
    if (hasTranslated) {
      handleTranslate();
    }
  }, [outputLanguage]);

  return (
    <>
      <Head>
        <title>Creativeminds AI Code Translator</title>
        <meta name="description" content="Use AI to translate code from one language to another." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster position="top-right" />

      <main className="flex min-h-screen flex-col items-center bg-[#0E1117] px-4 py-10 text-neutral-200">
        <h1 className="mb-8 text-4xl font-bold text-center">Creativeminds AI Code Translator</h1>

        <div className="mb-4 flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <ModelSelect model={model} onChange={(value) => setModel(value)} />
          <button
            className="rounded-lg bg-violet-600 px-6 py-2 font-semibold hover:bg-violet-700 disabled:opacity-50"
            onClick={handleTranslate}
            disabled={loading}
          >
            {loading ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-center">Input</h2>
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

          <div className="flex flex-col space-y-2">
            <h2 className="text-xl font-semibold text-center">Output</h2>
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
      </main>
    </>
  );
}
