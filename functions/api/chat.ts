import { createChatHandler, createGeminiGenerator } from "@folio-agent/handler";
import knowledgeDoc from "../../dist/knowledge.json";

const knowledge = knowledgeDoc.pages.map((page) => `# ${page.url}\n\n${page.text}`).join("\n\n");

interface Env {
  DB: D1Database;
  GEMINI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const handle = createChatHandler({
    db: context.env.DB,
    generateAnswer: createGeminiGenerator({
      apiKey: context.env.GEMINI_API_KEY,
      knowledge,
      contactUrl: "https://ykts.net/contact/",
    }),
  });
  return handle(context.request);
};
