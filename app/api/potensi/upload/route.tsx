import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob"; // Ganti fs & path dengan ini
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Utility untuk menyimpan file ke Vercel Blob
async function saveFile(file: File) {
  // Langsung upload ke cloud, Vercel otomatis menangani penamaan unik
  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return blob.url; // Mengembalikan link https://...
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const sektor          = formData.get("sektor")?.toString() || "";
    const judulGambar     = formData.get("judulGambar")?.toString() || "";
    const komoditas       = formData.get("komoditas")?.toString() || "";
    const deskripsiGambar = formData.get("deskripsiGambar")?.toString() || "";
    const deskripsiSektor = formData.get("deskripsiSektor")?.toString() || "";
    const file            = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File wajib diupload." }, { status: 400 });
    }

    // Panggil utility saveFile yang baru
    const imageUrl = await saveFile(file);

    const potensi = await prisma.potensi.create({
      data: {
        sektor,
        judulGambar,
        komoditas,
        deskripsiGambar,
        deskripsiSektor,
        image: imageUrl,
      },
    });

    // Update cache agar data masuk ke halaman user
    revalidatePath("/potensi");
    revalidatePath("/admin/potensi");

    return NextResponse.json({ message: "Berhasil menambahkan potensi.", potensi });
  } catch (err: any) {
    console.error("Tambah Potensi Error:", err);
    return NextResponse.json({ error: err.message || "Terjadi kesalahan server." }, { status: 500 });
  }
}