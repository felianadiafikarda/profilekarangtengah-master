import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob"; 
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const formData      = await req.formData();
    const id            = Number(formData.get("id"));
    const namaFasilitas = formData.get("namaFasilitas") as string;
    const kategori      = formData.get("kategori") as string;
    const file          = formData.get("file") as File | null;
    let   image         = formData.get("existingImage") as string;

    // Jika ada file baru yang diunggah
    if (file && file.size > 0) {
      // Langsung upload ke Vercel Blob
      const blob = await put(file.name, file, {
        access: "public",
      });

      // Ambil URL permanen dari Vercel Blob (https://...)
      image = blob.url;
    }

    // Update database Neon lewat Prisma
    await prisma.fasilitas.update({
      where: { id },
      data: { namaFasilitas, kategori, image },
    });

    // Bersihkan cache agar perubahan langsung muncul di web
    revalidatePath("/admin/fasilitas");
    revalidatePath("/fasilitas"); 

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Edit error:", err);
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 });
  }
}