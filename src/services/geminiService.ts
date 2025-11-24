import { GoogleGenAI } from "@google/genai";
import type { LessonParams } from '../types';
import { SYSTEM_INSTRUCTION } from '../constants';

const getClient = () => {
  // Menggunakan import.meta.env untuk Vite
  // @ts-ignore - Mengabaikan error type checking environment jika interface env belum didefinisikan
  const apiKey = import.meta.env.VITE_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key tidak ditemukan. Pastikan environment variable VITE_API_KEY sudah diatur.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLessonPlan = async (params: LessonParams): Promise<string> => {
  const ai = getClient();
  
  const userPrompt = `
    Tolong susun Perangkat Pembelajaran Lengkap (Modul Ajar + Materi & LKPD) untuk:
    
    Identitas Modul:
    - Nama Penulis: ${params.author || '-'}
    - Asal Sekolah: ${params.school || '-'}
    - Alokasi Waktu/Durasi: ${params.duration || '-'}
    
    Data Pembelajaran:
    - Mata Pelajaran: ${params.subject}
    - Materi Topik: ${params.topic}
    - Kelas: ${params.grade}
    ${params.integration ? `- Integrasi Mapel Lain: ${params.integration}` : ''}
    
    Instruksi Khusus:
    1. Pastikan mengikuti struktur TAHAP 1 (Modul Ajar Deep Learning) dan TAHAP 2 (Materi & LKPD).
    2. Pada bagian INFORMASI UMUM, masukkan data identitas di atas.
    3. Pada bagian "Mengaplikasi (To Apply)", berikan contoh konkret aktivitas siswa yang sesuai dengan durasi ${params.duration || 'standar'}.
    4. Buatkan rubrik penilaian dalam format tabel.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance creativity with structure
      }
    });

    return response.text || "Maaf, gagal menghasilkan konten. Silakan coba lagi.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Terjadi kesalahan saat menghubungi layanan AI.");
  }
};