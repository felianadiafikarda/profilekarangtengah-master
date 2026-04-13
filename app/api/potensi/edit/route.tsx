import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob"; // Pengganti fs dan path
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const id = Number(formData.get("id"));
    const judulGambar = formData.get("judulGambar") as string;
    const sektor = formData.get("sektor") as string;
    const komoditas = formData.get("komoditas") as string;
    const deskripsiGambar = formData.get("deskripsiGambar") as string;
    const deskripsiSektor = formData.get("deskripsiSektor") as string;
    const existingImage = formData.get("existingImage") as string;

    let image = existingImage;

    // Cek apakah ada file baru yang diunggah
    const file = formData.get("file") as File | null;
    if (file && file.size > 0) {
      // 1. Upload langsung ke Vercel Blob
      // Kita tidak perlu buat buffer manual atau mkdirSync lagi
      const blob = await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
      });

      // 2. Gunakan URL hasil upload dari Blob
      image = blob.url;
    }

    // 3. Update data di database Neon lewat Prisma
    await prisma.potensi.update({
      where: { id },
      data: {
        judulGambar,
        sektor,
        komoditas,
        deskripsiGambar,
        deskripsiSektor,
        image // Sekarang berisi link https://...
      }
    });

    // 4. Tambahkan revalidatePath agar perubahan langsung terlihat di web
    revalidatePath("/potensi");
    revalidatePath("/admin/potensi");

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Potensi edit error:", error);
    return NextResponse.json(
      { error: "Gagal update potensi" },
      { status: 500 }
    );
  }
}