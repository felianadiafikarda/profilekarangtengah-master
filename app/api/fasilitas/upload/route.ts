import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob"; // Pengganti fs dan crypto

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file || file.size === 0) {
      return NextResponse.json({ error: "Tidak ada file" }, { status: 400 });
    }

    // Validasi tipe file tetap dipertahankan
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
    }
    
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    });

    // 2. Kembalikan URL publik dari Vercel Blob
    // Hasilnya akan berupa link https://... yang bisa diakses siapa saja
    return NextResponse.json({ url: blob.url });

  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Gagal menyimpan file ke cloud" }, { status: 500 });
  }
}