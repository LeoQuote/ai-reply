import { Probot } from "probot";
import OpenAI from 'openai';

import { Config } from "./types.js";
import { JSDOM } from 'jsdom';
import { Readability } from "@mozilla/readability";
import { NodeHtmlMarkdown } from "node-html-markdown";


const DEFAULT_CONFIG = {
  global: {
    prompt: "You are an AI assistant, here's an github issue, help with it",
    confidence: 0.5,
    max_tokens: 150,
    temperature: 0.5,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    model: "gpt-3.5-turbo"
  }
} as Config;

const DEFAULT_REPLY = "sorry, ai reply failed"

const openai = new OpenAI();

export const htmlToMarkdown = (html: string, url: string) => {
  const doc = new JSDOM(html, { url });

  const article = new Readability(doc.window.document).parse();
  const content = NodeHtmlMarkdown.translate(article?.content || '', {});

  return { ...article, content };
};

async function fetchContent(data: { url: string }) {
  try {
    const response = await fetch(data.url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Fetch failed: ${error}`);
    throw error;
  }
}

export default (app: Probot) => {
  app.on("issues.opened", async (context) => {
    if (!context.payload.issue.body) {
      return;
    }
    let config = await context.config("ai-reply.yml") as Config;
    config = { ...DEFAULT_CONFIG, ...config }; // Merge config and DEFAULT_CONFIG, prioritizing config values
    const aiConfig = { ...config.global, ...config.issue };
    let messages = []
    if (aiConfig.wiki) {
      const wikiContent = await fetchContent({ url: aiConfig.wiki });
      const markdown = htmlToMarkdown(wikiContent, aiConfig.wiki);
      messages.push({ role: 'system', content: `a wiki page that might help you:\n${markdown.content}` });
    }
    messages.push({ role: 'user', content: `${aiConfig.prompt}\n${context.payload.issue.body}` });
    messages = messages as OpenAI.Chat.ChatCompletionMessageParam[];
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: messages,
      model: aiConfig.model || "gpt-3.5-turbo", // Assign a default value if aiConfig.model is undefined
    };
    const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params);
    if (chatCompletion.choices.length === 0 || chatCompletion.choices[0].message.content === '') {
      return;
    }
    const issueComment = context.issue({
      body: chatCompletion.choices[0].message.content || DEFAULT_REPLY, // Ensure body is not nullable
    });
    await context.octokit.issues.createComment(issueComment);
  });
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
