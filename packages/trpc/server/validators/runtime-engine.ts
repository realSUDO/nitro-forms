import { z } from "zod";

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  options?: string[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    minSelected?: number;
    maxSelected?: number;
  };
}

function buildFieldSchema(field: FormField): z.ZodType {
  let schema: z.ZodType;

  switch (field.type) {
    case "short_text":
    case "long_text": {
      let s = z.string();
      if (field.validation?.minLength) s = s.min(field.validation.minLength);
      if (field.validation?.maxLength) s = s.max(field.validation.maxLength);
      schema = s;
      break;
    }
    case "email":
      schema = z.string().email("Invalid email address");
      break;
    case "number": {
      let n = z.coerce.number();
      if (field.validation?.min !== undefined) n = n.min(field.validation.min);
      if (field.validation?.max !== undefined) n = n.max(field.validation.max);
      schema = n;
      break;
    }
    case "single_select":
      if (field.options && field.options.length > 0) {
        schema = z.enum(field.options as [string, ...string[]]);
      } else {
        schema = z.string();
      }
      break;
    case "multi_select": {
      let arr = field.options?.length
        ? z.array(z.enum(field.options as [string, ...string[]]))
        : z.array(z.string());
      if (field.validation?.minSelected) arr = arr.min(field.validation.minSelected);
      if (field.validation?.maxSelected) arr = arr.max(field.validation.maxSelected);
      schema = arr;
      break;
    }
    case "checkbox":
      schema = z.coerce.boolean();
      break;
    case "rating": {
      const min = field.validation?.min ?? 1;
      const max = field.validation?.max ?? 5;
      schema = z.coerce.number().min(min).max(max);
      break;
    }
    case "date":
      schema = z.string().refine((v) => !isNaN(Date.parse(v)), { message: "Invalid date" });
      break;
    case "time":
      schema = z.string().regex(/^\d{2}:\d{2}/, "Invalid time format");
      break;
    case "phone":
      schema = z.string().min(7, "Phone number too short").max(20, "Phone number too long");
      break;
    case "url":
      schema = z.string().url("Invalid URL");
      break;
    case "file_upload":
      schema = z.any(); // File validation handled at upload layer
      break;
    default:
      schema = z.string();
  }

  if (!field.required) {
    schema = schema.optional() as z.ZodType;
  }

  return schema;
}

export function buildResponseSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) {
    shape[field.id] = buildFieldSchema(field);
  }
  return z.object(shape);
}

export function validateResponse(fields: FormField[], answers: Record<string, unknown>) {
  const schema = buildResponseSchema(fields);
  const result = schema.safeParse(answers);
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const fieldId = issue.path[0]?.toString() ?? "unknown";
    errors[fieldId] = issue.message;
  }
  return { success: false as const, errors };
}
