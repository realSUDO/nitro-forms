# @nitroforms/sdk

Official TypeScript/JavaScript SDK for the [NitroForms](https://nitroforms.fun) API.

## Install

```bash
npm install @nitroforms/sdk
```

## Quick Start

```typescript
import { NitroForms } from '@nitroforms/sdk';

const nitro = new NitroForms('nitro_sk_your_api_key');

// List your forms
const { forms } = await nitro.forms.list();

// Create a form
const { form } = await nitro.forms.create({
  title: 'Customer Feedback',
  fields: [
    { id: 'f1', type: 'email', label: 'Email', required: true },
    { id: 'f2', type: 'rating', label: 'How was your experience?', required: true },
    { id: 'f3', type: 'long_text', label: 'Comments', required: false },
  ],
});

// Get form details
const { form: detail } = await nitro.forms.get('customer-feedback-abc123');

// Submit a response (no API key needed)
const result = await nitro.forms.submit('customer-feedback-abc123', {
  answers: { f1: 'user@example.com', f2: 5, f3: 'Great service!' },
});
```

## Authentication

Get your API key from the NitroForms dashboard (Settings > API Keys).

```typescript
// Simple
const nitro = new NitroForms('nitro_sk_...');

// With custom base URL (self-hosted)
const nitro = new NitroForms({
  apiKey: 'nitro_sk_...',
  baseUrl: 'https://your-server.com/api/v2',
});
```

## API Reference

### `nitro.forms.list()`
Returns all forms owned by the API key holder.

### `nitro.forms.create(input)`
Creates a new form. Fields are optional — you can add them later in the builder.

### `nitro.forms.get(slug)`
Gets full form details including fields and settings.

### `nitro.forms.submit(slug, { answers })`
Submits a response to a published form. **Does not require an API key** — forms are public by default.

## Field Types

| Type | Description |
|------|-------------|
| `short_text` | Single-line text input |
| `long_text` | Multi-line textarea |
| `email` | Email with validation |
| `number` | Numeric input |
| `phone` | Phone number |
| `url` | URL with validation |
| `single_select` | Radio/dropdown (requires `options`) |
| `multi_select` | Checkboxes (requires `options`) |
| `checkbox` | Yes/No toggle |
| `rating` | 1-5 star rating |
| `date` | Date picker |
| `time` | Time picker |
| `file_upload` | File attachment |

## Error Handling

```typescript
import { NitroForms, NitroFormsError } from '@nitroforms/sdk';

try {
  await nitro.forms.submit('my-form', { answers: {} });
} catch (e) {
  if (e instanceof NitroFormsError) {
    console.log(e.message); // "Validation failed"
    console.log(e.status);  // 422
  }
}
```

## Rate Limits

- Authenticated requests: 60/minute per IP
- Public submissions: 5 per 10 minutes per form per IP

## Building from Source

```bash
cd packages/sdk
pnpm install
pnpm build
```

Output: `dist/index.js` (CJS), `dist/index.mjs` (ESM), `dist/index.d.ts` (types)

## Publishing

```bash
cd packages/sdk
npm publish --access public
```

## License

MIT
