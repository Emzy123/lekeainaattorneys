import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "../../../auth";

// Configure Cloudinary
// It automatically picks up CLOUDINARY_URL from process.env if available
cloudinary.config({
  secure: true,
});

export async function POST(req: Request) {
  try {
    // 1. Verify Authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // 3. Convert File to ArrayBuffer -> Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "lex_platform" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    // 5. Return the secure URL
    return NextResponse.json({ 
      url: (uploadResult as any).secure_url 
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error during upload" },
      { status: 500 }
    );
  }
}
