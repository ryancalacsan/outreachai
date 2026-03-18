import { serverEnvSchema } from "./schemas";

let validated = false;
let env: ReturnType<typeof serverEnvSchema.parse>;

export function getServerEnv() {
  if (!validated) {
    const result = serverEnvSchema.safeParse(process.env);
    if (!result.success) {
      const issues = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`Environment variable validation failed: ${issues}`);
    }
    env = result.data;
    validated = true;
  }
  return env;
}

export function requireEnv(key: "ANTHROPIC_API_KEY" | "GEMINI_API_KEY" | "DEMO_ACCESS_CODE"): string {
  const value = getServerEnv()[key];
  if (!value) {
    throw new Error(`${key} is not configured`);
  }
  return value;
}
