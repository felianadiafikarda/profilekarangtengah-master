import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob"; // Pakai ini sebagai pengganti fs
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const formData      = await req.formData();
    const namaFasilitas = (formData.get("namaFasilitas") as string)?.trim();
    const kategori      = (formData.get("kategori") as string)?.trim();
    const mapLink       = (formData.get("mapLink") as string)?.trim();
    const file          = formData.get("file") as File | null;

    // Validasi input
    if (!namaFasilitas || !kategori || !mapLink || !file || file.size === 0) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    // 1. Upload langsung ke Vercel Blob
    // Nama file unik akan diatur otomatis oleh Vercel
    const blob = await put(file.name, file, {
      access: "public",
    });

    // 2. Gunakan URL dari blob untuk disimpan ke database
    const image = blob.url;

    // 3. Simpan data baru ke database Neon lewat Prisma
    await prisma.fasilitas.create({
      data: { 
        namaFasilitas, 
        kategori, 
        image, // Berisi link https://...
        mapLink 
      },
    });

    // 4. Update cache agar data baru langsung muncul
    revalidatePath("/admin/fasilitas");
    revalidatePath("/fasilitas"); // Sesuaikan dengan path halaman user

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Tambah error:", err);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}