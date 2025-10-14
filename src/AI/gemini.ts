import { Siswa, Nilai } from "@/type";

// Interface untuk struktur respons dari Gemini API
interface GeminiApiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: { message?: string };
}
export async function generateStudentAnalysis(
  siswa: Siswa,
  nilai: Nilai | undefined,
  apiKey: string
): Promise<AnalysisReport> {

  const prompt = `
    Anda adalah seorang konselor sekolah dan psikolog pendidikan yang bijaksana.
    Tugas Anda adalah menganalisis data siswa berikut dan memberikan laporan terstruktur dalam format JSON.

    Data Siswa:
    - Nama: ${siswa.nama}
    - Kelas: ${siswa.kelas}
    - Usia: ${siswa.tanggalLahir ? new Date().getFullYear() - new Date(siswa.tanggalLahir).getFullYear() : 'Tidak diketahui'} tahun
    - Nilai Semester Ganjil:
      - Harian (NH): ${nilai?.nh_ganjil || 'N/A'}
      - STS: ${nilai?.sts_ganjil || 'N/A'}
      - SAS: ${nilai?.sas_ganjil || 'N/A'}
    - Nilai Semester Genap:
      - Harian (NH): ${nilai?.nh_genap || 'N/A'}
      - STS: ${nilai?.sts_genap || 'N/A'}
      - SAS: ${nilai?.sas_genap || 'N/A'}
    - Catatan Baik: ${nilai?.catatan_baik || 'Tidak ada'}
    - Catatan Buruk: ${nilai?.catatan_buruk || 'Tidak ada'}

    Berikan analisis mendalam dengan menghubungkan titik-titik data.
    Misalnya, hubungkan penurunan nilai dengan catatan sikap atau masalah lain yang mungkin terjadi.
    
    Format output HARUS berupa JSON yang valid dengan struktur seperti ini, tanpa blok kode:
    {
      "ringkasan": "Ringkasan utama dalam satu kalimat.",
      "analisisNilai": {
        "kekuatan": "Sebutkan kekuatan utama dari nilai siswa.",
        "peningkatan": "Sebutkan area nilai yang perlu ditingkatkan."
      },
      "analisisSikap": "Analisis berdasarkan catatan baik dan buruk.",
      "saran": [
        "Saran pertama yang konkret dan dapat ditindaklanjuti.",
        "Saran kedua.",
        "Saran ketiga."
      ]
    }
  `;

  if (!apiKey) {
    throw new Error("API Key Gemini tidak ditemukan. Silakan atur di halaman Data Siswa.");
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  const serverResponse = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const responseJson: GeminiApiResponse = await serverResponse.json();

  if (!serverResponse.ok) {
    const errorMessage = responseJson?.error?.message || 'Gagal menghubungi server AI.';
    throw new Error(errorMessage);
  }
  
  if (!responseJson.candidates || !responseJson.candidates[0].content.parts[0].text) {
    throw new Error("Struktur respons dari API tidak valid.");
  }
  const jsonString = responseJson.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonString) as AnalysisReport;
}

export interface AttitudeData {
  positive: string[];
  negative: string[];
  sakit: number;
  izin: number;
  alfa: number;
  apiKey: string;
}

export interface AttitudeNotes {
  catatan_baik: string;
  catatan_buruk: string;
}

export async function generateAttitudeNotes(
  studentName: string,
  attitudeData: AttitudeData
): Promise<AttitudeNotes> {

  const prompt = `
    Anda adalah seorang wali kelas yang sedang menulis catatan untuk rapor siswa bernama ${studentName}.

    Data Sikap Siswa:
    - Indikator Positif yang menonjol: ${attitudeData.positive.join(', ') || 'Tidak ada'}
    - Indikator Perlu Peningkatan: ${attitudeData.negative.join(', ') || 'Tidak ada'}
    - Kehadiran: ${attitudeData.sakit} hari sakit, ${attitudeData.izin} hari izin, ${attitudeData.alfa} hari tanpa keterangan.

    Tugas Anda:
    1. Buat "catatan_baik": Sebuah kalimat naratif yang memuji dan memotivasi berdasarkan indikator positif.
    2. Buat "catatan_buruk": Sebuah kalimat naratif yang konstruktif dan sopan untuk area yang perlu ditingkatkan. Jika ada 'alfa', sebutkan pentingnya kehadiran.

    Format output HARUS berupa JSON yang valid dengan struktur seperti ini, tanpa blok kode:
    {
      "catatan_baik": "Tulis deskripsi naratif yang baik di sini.",
      "catatan_buruk": "Tulis deskripsi naratif untuk perbaikan di sini."
    }
  `;

  if (!attitudeData.apiKey) {
    throw new Error("API Key Gemini tidak ditemukan. Silakan atur di halaman Data Siswa.");
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${attitudeData.apiKey}`;
  const serverResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });

  const responseJson: GeminiApiResponse = await serverResponse.json();

  if (!serverResponse.ok) {
    const errorMessage = responseJson?.error?.message || 'Gagal menghubungi server AI.';
    throw new Error(errorMessage);
  }

  const jsonString = responseJson.candidates[0].content.parts[0].text.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(jsonString) as AttitudeNotes;
}

export interface TeacherNoteData {
  studentName: string;
  semester: 'ganjil' | 'genap';
  overallGanjil?: number | string;
  overallGenap?: number | string;
  attendance: {
    sakit: number;
    izin: number;
    alfa: number;
  };
  apiKey: string;
}

export interface TeacherNoteResult {
  note: string;
}

export async function generateTeacherNote(
  data: TeacherNoteData
): Promise<TeacherNoteResult> {
  const isGenap = data.semester === 'genap';

  const prompt = `Anda adalah seorang wali kelas yang bijaksana dan perhatian. Buatkan "Catatan Wali Kelas" (2-3 kalimat) untuk rapor siswa bernama ${data.studentName}. Mulai catatan Anda dengan menyebut nama siswa, contoh: "Ananda ${data.studentName} menunjukkan..." atau variasinya.

Konteks:
- Semester saat ini: ${data.semester}.
- Rata-rata nilai rapor ganjil: ${data.overallGanjil || 'N/A'}.
${isGenap ? `- Rata-rata nilai rapor genap: ${data.overallGenap || 'N/A'}.` : ''}
- Kehadiran: Sakit (${data.attendance.sakit} hari), Izin (${data.attendance.izin} hari), Tanpa Keterangan (${data.attendance.alfa} hari).

Fokus pada motivasi, potensi, dan saran yang membangun. Jika ada data 'Tanpa Keterangan' (alfa), berikan nasihat singkat dan sopan mengenai pentingnya kehadiran. Jika ada tren nilai (naik/turun), berikan komentar positif.

Berikan respons dalam format JSON dengan satu kunci "note".
Contoh: {"note": "Ananda ${data.studentName} menunjukkan perkembangan yang baik..."}
`;

  if (!data.apiKey) {
    throw new Error("API Key Gemini tidak ditemukan.");
  }

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${data.apiKey}`;
  const serverResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: "application/json" }
    }),
  });

  const responseJson: GeminiApiResponse = await serverResponse.json();

  if (!serverResponse.ok) {
    const errorMessage = responseJson?.error?.message || 'Gagal menghubungi server AI.';
    throw new Error(errorMessage);
  }

  const jsonString = responseJson.candidates[0].content.parts[0].text;
  return JSON.parse(jsonString) as TeacherNoteResult;
}