import React, { useState } from 'react';
import { useRaportData } from '../contexts/useRaportData';
import AIResponseModal from '../components/AIResponseModal';
import SubjectManagerModal from '../components/SubjectManagerModal';
import StudentSelector from '../components/StudentSelector';
import SubjectGrades from '../components/SubjectGrades';
import { useAIAssistant } from '@/AI/hooks/useAIAssistant';
import toast, { Toaster } from 'react-hot-toast';
import Button from '@/Komponen/Button';
import { User, Send, Trash2, Bot, FileText, BrainCircuit } from 'lucide-react';

const RaportAiPage: React.FC = () => {
  const { siswaList, setNilai, subjects, nilai, isLoading } = useRaportData();
  const [selectedSiswaId, setSelectedSiswaId] = useState<string | null>(null);
  const [isSubjectManagerOpen, setIsSubjectManagerOpen] = useState(false);
  const [isAIResponseModalOpen, setIsAIResponseModalOpen] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [prompt, setPrompt] = useState('');  
  const { isLoading: isGenerating, generateAutoPrompt, generateAIResponse } = useAIAssistant();



  // Fungsi untuk mengirim prompt ke AI
  const handleGenerateAI = async () => {
    if (!selectedSiswaId) {
      toast.error('Silakan pilih siswa terlebih dahulu');
      return;
    }

    const siswa = siswaList.find(s => s.id === selectedSiswaId);
    if (!siswa) return;

    const finalPrompt = prompt || generateAutoPrompt(siswa, nilai[selectedSiswaId] || {}, subjects);
    if (!finalPrompt.trim()) {
      toast.error('Silakan masukkan prompt atau gunakan prompt otomatis');
      return;
    }

    try {
      const response = await generateAIResponse(finalPrompt);
      setAiResponse(response);
      setIsAIResponseModalOpen(true);
    } catch {
      // Error sudah ditangani di dalam hook, tidak perlu toast lagi di sini.
    }
  };

  // Fungsi untuk mereset semua nilai
  const handleResetNilai = () => {
    setNilai({}); // Reset nilai di context
    toast.success('Nilai berhasil direset');
  };

  // Mendapatkan data siswa yang dipilih
  const selectedSiswa = selectedSiswaId 
    ? siswaList.find(s => s.id === selectedSiswaId) 
    : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-primary-600" />
            Raport AI
          </h1>
          <p className="mt-1 text-slate-600">
            Kelola nilai siswa dan dapatkan analisis pembelajaran dengan bantuan AI.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setIsSubjectManagerOpen(true)}
          >
            <FileText className="mr-2 h-4 w-4" /> Kelola Mapel
          </Button>
          <Button variant="outline" onClick={handleResetNilai}>
            <Trash2 className="mr-2 h-4 w-4" /> Reset Nilai
          </Button>
        </div>
      </div>

      {/* Kontrol Utama & Input Nilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Kiri - Seleksi dan AI */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Pilih Siswa</h2>
            <StudentSelector 
              selectedSiswa={selectedSiswa}
              onSelectSiswa={(siswa) => {
                setSelectedSiswaId(siswa ? siswa.id : null);
              }}
            />
          </div>

          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Bot className="text-primary-600"/> Asisten AI
            </h2>
            <div className="flex flex-col gap-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ketik prompt atau kosongkan untuk prompt otomatis..."
                className="flex-1 p-3 border border-slate-300 rounded-lg min-h-[100px] bg-transparent focus:ring-2 focus:ring-primary-500"
                disabled={isGenerating}
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    const siswa = siswaList.find(s => s.id === selectedSiswaId);
                    if (siswa) {
                      const autoPrompt = generateAutoPrompt(siswa, nilai[selectedSiswaId] || {}, subjects);
                      setPrompt(autoPrompt);
                      toast.success('Prompt otomatis dibuat!');
                    }
                  }}
                  disabled={!selectedSiswaId || isGenerating}
                  className="flex-1"
                >
                  Buat Prompt
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleGenerateAI}
                  disabled={isGenerating || (!prompt.trim() && !selectedSiswaId)}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span> Menganalisis...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" /> Kirim ke AI
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel Kanan - Input Nilai */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft p-6 min-h-full">
            <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-lg font-semibold text-slate-800">Input Nilai Mata Pelajaran</h2>
              {selectedSiswa && (
                <div className="flex items-center text-primary-600 font-medium">
                  <User className="mr-2 h-4 w-4" />
                  <span>{selectedSiswa.nama} - {selectedSiswa.kelas}</span>
                </div>
              )}
            </div>

            {selectedSiswa ? (
              <SubjectGrades selectedSiswa={selectedSiswa} />
            ) : (
              <div className="text-center py-16 flex flex-col items-center justify-center h-full">
                <User className="mx-auto text-5xl text-slate-300 mb-4" />
                <p className="font-semibold text-slate-600">Pilih Siswa Terlebih Dahulu</p>
                <p className="text-sm text-slate-500">Silakan pilih siswa dari panel di sebelah kiri untuk mulai menginput nilai.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SubjectManagerModal 
        isOpen={isSubjectManagerOpen}
        onClose={() => setIsSubjectManagerOpen(false)} 
      />

      <AIResponseModal 
        isOpen={isAIResponseModalOpen}
        onClose={() => setIsAIResponseModalOpen(false)}
        selectedSiswa={selectedSiswa}
        response={aiResponse}
        isLoading={isGenerating}
      />
    </div>
  );
};

export default RaportAiPage;