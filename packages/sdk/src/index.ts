/**
 * NitroForms SDK
 * Official TypeScript/JavaScript SDK for the NitroForms API.
 *
 * @example
 * ```ts
 * import { NitroForms } from '@nitroforms/sdk';
 * const nitro = new NitroForms('nitro_sk_your_key');
 * const forms = await nitro.forms.list();
 * ```
 */

export interface NitroFormsConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface Form {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "archived";
  visibility: "public" | "unlisted";
  createdAt: string;
}

export interface FormDetail extends Form {
  description: string | null;
  fields: FormField[];
  settings: Record<string, unknown>;
}

export interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface CreateFormInput {
  title: string;
  fields?: FormField[];
}

export interface SubmitResponseInput {
  answers: Record<string, unknown>;
}

export interface SubmitResult {
  message: string;
  responseId: string;
}

export class NitroForms {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKeyOrConfig: string | NitroFormsConfig) {
    if (typeof apiKeyOrConfig === "string") {
      this.apiKey = apiKeyOrConfig;
      this.baseUrl = "https://nitroforms.fun/api/v2";
    } else {
      this.apiKey = apiKeyOrConfig.apiKey;
      this.baseUrl = apiKeyOrConfig.baseUrl ?? "https://nitroforms.fun/api/v2";
    }
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new NitroFormsError(body.error ?? `HTTP ${res.status}`, res.status);
    }
    return res.json();
  }

  /** Form operations (requires API key) */
  forms = {
    /** List all your forms */
    list: (): Promise<{ forms: Form[] }> => this.request("/forms"),

    /** Create a new form */
    create: (input: CreateFormInput): Promise<{ form: FormDetail }> =>
      this.request("/forms", { method: "POST", body: JSON.stringify(input) }),

    /** Get a form by slug */
    get: (slug: string): Promise<{ form: FormDetail }> => this.request(`/forms/${slug}`),

    /** Submit a response to a form (no API key needed) */
    submit: (slug: string, input: SubmitResponseInput): Promise<SubmitResult> =>
      fetch(`${this.baseUrl}/forms/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }).then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new NitroFormsError(body.error ?? `HTTP ${res.status}`, res.status);
        }
        return res.json();
      }),
  };
}

export class NitroFormsError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "NitroFormsError";
    this.status = status;
  }
}

export default NitroForms;
