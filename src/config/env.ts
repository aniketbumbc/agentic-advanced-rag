export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_CHAT_MODEL: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o',
  DATABASE_URL: process.env.DATABASE_URL!,
  REDIS_URL: process.env.REDIS_URL!,
};
