/*
配置文件格式

global:
  prompt: "你好，我是AI助手，有什么可以帮助你的？"
  confidence: 0.5
  max_tokens: 150
  temperature: 0.5
  top_p: 1
  frequency_penalty: 0
  presence_penalty: 0
  model: "gpt-3.5-turbo"
issue:
  prompt: "你好，我是AI助手，有什么可以帮助你的？"
  confidence: 0.5
  max_tokens: 150
  temperature: 0.5
  top_p: 1
  frequency_penalty: 0
  presence_penalty: 0
  model: "gpt-3.5-turbo"
pull_request:
  prompt: "你好，我是AI助手，有什么可以帮助你的？"
  confidence: 0.5
  max_tokens: 150
  temperature: 0.5
  top_p: 1
  frequency_penalty: 0
  presence_penalty: 0
  model: "gpt-3.5-turbo"
*/
interface AIConfig {
  prompt: string;
  wiki?: string;
  confidence?: number;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  model?: string;
}

export interface Config {
  global: AIConfig;
  issue?: AIConfig;
  pull_request?: AIConfig;
}