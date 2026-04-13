import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob"; // Tambahkan ini
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const sektor = formData.get("sektor") as string;
    const judulGambar = formData.get("judulGambar") as string;
    const komoditas = formData.get("komoditas") as string;
    const deskripsiGambar = formData.get("deskripsiGambar") as string;
    const deskripsiSektor = formData.get("deskripsiSektor") as string;

    const file = formData.get("file") as File | null;

    let imagePath = "";

    // Jika ada file gambar, upload ke Vercel Blob
    if (file && file.size > 0) {
      // Langsung upload tanpa perlu mkdir atau buffer manual
      const blob = await put(file.name, file, {
        access: "public",
      });

      // Ambil link URL dari Vercel Blob
      imagePath = blob.url;
    }

    // Simpan ke database Neon melalui Prisma
    await prisma.potensi.create({
      data: {
        sektor,
        judulGambar,
        komoditas,
        deskripsiGambar,
        deskripsiSektor,
        image: imagePath // Sekarang berisi link https://...
      }
    });

    // Paksa web untuk refresh data terbaru
    revalidatePath("/potensi");
    revalidatePath("/admin/potensi");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Tambah Potensi error:", error);

    return NextResponse.json(
      { error: "Gagal upload potensi" },
      { status: 500 }
    );
  }
}