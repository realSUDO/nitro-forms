import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Simple in-memory rate limiting (IP -> [timestamps])
// Max 10 uploads per minute per IP
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

export async function POST(req: NextRequest) {
  try {
    // Basic Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
    const now = Date.now();
    
    if (ip !== "unknown") {
      const timestamps = rateLimitMap.get(ip) || [];
      const validTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
      if (validTimestamps.length >= RATE_LIMIT_MAX) {
        return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
      }
      validTimestamps.push(now);
      rateLimitMap.set(ip, validTimestamps);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 10MB file size limit
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds the 10MB limit." }, { status: 400 });
    }

    // Ensure upload directory exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    // Generate safe filename
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Hash original name + timestamp to avoid collisions
    const ext = path.extname(file.name) || "";
    const hash = crypto.randomBytes(8).toString("hex");
    const safeName = `${hash}${ext}`;
    
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ url: `/api/file/${safeName}`, name: file.name });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
