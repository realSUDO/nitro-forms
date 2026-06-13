import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import mime from "mime"; // Note: this requires 'mime' package, we should probably check if it's installed.

export async function GET(req: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename;
    
    // Prevent directory traversal attacks
    if (!filename || filename.includes("/") || filename.includes("..")) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    const filePath = path.join(process.cwd(), "uploads", filename);
    
    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Determine content type
      let contentType = "application/octet-stream";
      const ext = path.extname(filename).toLowerCase();
      if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".csv") contentType = "text/csv";
      else if (ext === ".txt") contentType = "text/plain";
      // Add more if necessary... we don't strictly need the `mime` package if we cover basics.

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          // Inline for images/pdfs so they can be viewed, attachment otherwise. 
          // Since the user said "download file", it's better to force attachment or let the frontend `download` attribute handle it.
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch (err) {
      return new NextResponse("File not found", { status: 404 });
    }
  } catch (err) {
    console.error("File download error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
