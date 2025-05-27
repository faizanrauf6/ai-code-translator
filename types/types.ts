export type TogetherModel =
  | 'meta-llama/Llama-3.3-70B-Instruct-Turbo'
  | 'bigcode/starcoder2-15b'
  | 'deepseek-ai/deepseek-coder-33b-instruct';

export interface TranslateBody {
  inputLanguage: string;
  outputLanguage: string;
  inputCode: string;
  model: TogetherModel;
}


export interface TranslateResponse {
  code: string;
}
