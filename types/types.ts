export type OpenAIModel = 'gpt-3.5' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-1106' | 'gpt-3.5-16k' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-16k-0613' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-4-32k' | 'gpt-4-0613' | 'gpt-4-32k-0613' | 'gpt-4-1106-preview' | 'babbage-002' | 'davinci-002';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: OpenAIModel;
  apiKey: string;
}


export interface TranslateResponse {
  code: string;
}
