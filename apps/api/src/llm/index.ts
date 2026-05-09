import { env } from "../config";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmCompletionOptions {
  messages: LlmMessage[];
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

export interface LlmCompletionResult {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface LlmStreamChunk {
  content: string;
  done: boolean;
}

// ─── Provider interface ─────────────────────────────────────────────────────

export interface LlmProvider {
  complete(opts: LlmCompletionOptions): Promise<LlmCompletionResult>;
  stream(
    opts: LlmCompletionOptions,
  ): AsyncGenerator<LlmStreamChunk, void, unknown>;
}

// ─── Anthropic provider ─────────────────────────────────────────────────────

class AnthropicProvider implements LlmProvider {
  private apiKey: string;
  private baseUrl = "https://api.anthropic.com/v1";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async complete(opts: LlmCompletionOptions): Promise<LlmCompletionResult> {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: opts.model ?? "claude-3-7-sonnet-20250219",
        max_tokens: opts.maxTokens ?? 4096,
        temperature: opts.temperature ?? 0.7,
        messages: opts.messages.filter((m) => m.role !== "system"),
        system: opts.messages.find((m) => m.role === "system")?.content,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      content: Array<{ type: string; text: string }>;
      model: string;
      usage?: { input_tokens: number; output_tokens: number };
    };

    const text = data.content
      .filter((c) => c.type === "text")
      .map((c) => c.text)
      .join("");

    return {
      content: text,
      model: data.model,
      usage: data.usage
        ? {
            inputTokens: data.usage.input_tokens,
            outputTokens: data.usage.output_tokens,
          }
        : undefined,
    };
  }

  async *stream(
    opts: LlmCompletionOptions,
  ): AsyncGenerator<LlmStreamChunk, void, unknown> {
    const res = await fetch(`${this.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: opts.model ?? "claude-3-7-sonnet-20250219",
        max_tokens: opts.maxTokens ?? 4096,
        temperature: opts.temperature ?? 0.7,
        messages: opts.messages.filter((m) => m.role !== "system"),
        system: opts.messages.find((m) => m.role === "system")?.content,
        stream: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic API error ${res.status}: ${text}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            yield { content: "", done: true };
            return;
          }
          try {
            const parsed = JSON.parse(jsonStr) as {
              type: string;
              delta?: { text?: string };
            };
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              yield { content: parsed.delta.text, done: false };
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { content: "", done: true };
  }
}

// ─── GLM provider (OpenAI-compatible) ───────────────────────────────────────

class GlmProvider implements LlmProvider {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  async complete(opts: LlmCompletionOptions): Promise<LlmCompletionResult> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: opts.model ?? "glm-5",
        messages: opts.messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 4096,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GLM API error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      choices: Array<{
        message: { content: string };
      }>;
      model: string;
      usage?: { prompt_tokens: number; completion_tokens: number };
    };

    return {
      content: data.choices[0]?.message?.content ?? "",
      model: data.model,
      usage: data.usage
        ? {
            inputTokens: data.usage.prompt_tokens,
            outputTokens: data.usage.completion_tokens,
          }
        : undefined,
    };
  }

  async *stream(
    opts: LlmCompletionOptions,
  ): AsyncGenerator<LlmStreamChunk, void, unknown> {
    const res = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: opts.model ?? "glm-5",
        messages: opts.messages,
        temperature: opts.temperature ?? 0.7,
        max_tokens: opts.maxTokens ?? 4096,
        stream: true,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GLM API error ${res.status}: ${text}`);
    }

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            yield { content: "", done: true };
            return;
          }
          try {
            const parsed = JSON.parse(jsonStr) as {
              choices?: Array<{ delta?: { content?: string } }>;
            };
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              yield { content: delta, done: false };
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    yield { content: "", done: true };
  }
}

// ─── Provider resolution ────────────────────────────────────────────────────

/**
 * Get the preferred LLM provider based on env config.
 *
 * Preference: Anthropic → GLM → throw.
 */
export function getLlmProvider(prefer?: "anthropic" | "glm"): LlmProvider {
  const cfg = env();

  if (prefer === "glm" && cfg.GLM_API_KEY) {
    return new GlmProvider(cfg.GLM_API_KEY, cfg.GLM_BASE_URL);
  }

  if (cfg.ANTHROPIC_API_KEY) {
    return new AnthropicProvider(cfg.ANTHROPIC_API_KEY);
  }

  if (cfg.GLM_API_KEY) {
    return new GlmProvider(cfg.GLM_API_KEY, cfg.GLM_BASE_URL);
  }

  throw new Error(
    "No LLM provider configured. Set ANTHROPIC_API_KEY or GLM_API_KEY.",
  );
}

/**
 * Get the generator model name for provenance tracking.
 */
export function getGeneratorModelName(): string {
  const cfg = env();
  if (cfg.ANTHROPIC_API_KEY) {
    return cfg.GENERATOR_MODEL;
  }
  if (cfg.GLM_API_KEY) {
    return "glm-5";
  }
  return "unknown";
}
