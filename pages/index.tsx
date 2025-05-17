import Head from "next/head";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TranslateBody, OpenAIModel } from "@/types/types";

export default function Home() {
  const [inputLanguage, setInputLanguage] = useState("JavaScript");
  const [outputLanguage, setOutputLanguage] = useState("Python");
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [model, setModel] = useState<OpenAIModel>("gpt-3.5-turbo");
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    const maxCodeLength = model === "gpt-3.5-turbo" ? 6000 : 12000;

    if (inputLanguage === outputLanguage) return toast.error("Languages must differ.");
    if (!inputCode) return toast.error("Please enter some code.");
    if (inputCode.length > maxCodeLength)
      return toast.error(`Code exceeds ${maxCodeLength} characters.`);

    setLoading(true);
    setOutputCode("");

    const body: TranslateBody = {
      inputLanguage,
      outputLanguage,
      inputCode,
      model,
    };

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Translation failed");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let code = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        code += chunk;
        setOutputCode((prev) => prev + chunk);
      }

      toast.success("Translation complete. Copied to clipboard!");
      navigator.clipboard.writeText(code);
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Code Translator</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white px-4 py-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-center">AI Code Translator</h1>

        <div className="flex flex-wrap justify-center gap-4 w-full max-w-6xl mb-6">
          <div className="flex-1 min-w-[250px]">
            <label className="block mb-1 text-sm">Input Language</label>
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 rounded-md border border-gray-600 focus:outline-none"
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>Natural Language</option>
            </select>
          </div>

          <div className="flex-1 min-w-[250px]">
            <label className="block mb-1 text-sm">Output Language</label>
            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
              className="w-full bg-gray-800 px-4 py-2 rounded-md border border-gray-600 focus:outline-none"
            >
              <option>JavaScript</option>
              <option>Python</option>
              <option>TypeScript</option>
              <option>Java</option>
              <option>Natural Language</option>
            </select>
          </div>

          <div className="flex-1 min-w-[250px]">
            <label className="block mb-1 text-sm">Model</label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as OpenAIModel)}
              className="w-full bg-gray-800 px-4 py-2 rounded-md border border-gray-600 focus:outline-none"
            >
              <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              <option value="gpt-4">gpt-4</option>
            </select>
          </div>
        </div>

        <div className="flex w-full max-w-6xl gap-6 flex-col lg:flex-row">
          <div className="w-full lg:w-1/2">
            <label className="block mb-1 text-sm">Input Code</label>
            <textarea
              className="w-full h-[400px] p-4 bg-gray-800 border border-gray-600 rounded-md resize-none"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
          </div>

          <div className="w-full lg:w-1/2">
            <label className="block mb-1 text-sm">Output Code</label>
            <textarea
              className="w-full h-[400px] p-4 bg-gray-800 border border-gray-600 rounded-md resize-none"
              value={outputCode}
              readOnly
            />
          </div>
        </div>

        <button
          onClick={handleTranslate}
          disabled={loading}
          className="mt-6 bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-md font-bold disabled:opacity-50"
        >
          {loading ? "Translating..." : "Translate"}
        </button>
      </div>
    </>
  );
}
