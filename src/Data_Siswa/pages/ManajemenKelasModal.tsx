import React, { useState, useEffect, useMemo } from 'react';
import { useKelas } from '../hooks/useKelas';
import { useSiswa } from '../hooks/useSiswa';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/Komponen/Button';
import { Plus, Trash2, Edit, X, RotateCcw, Users, MessageCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Kelas } from '../types/type';

const kelasSchema = z.object({
  id: z.string().optional(),
  nama: z.string().min(1, 'Nama kelas tidak boleh kosong.'),
  waliKelas: z.string().optional(),
  kontakWaliKelas: z.string().optional().refine(val => !val || /^[0-9]+$/.test(val), {
    message: 'Hanya boleh berisi angka.',
  }),
});

type KelasFormValues = z.infer<typeof kelasSchema>;

interface ManajemenKelasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManajemenKelasModal: React.FC<ManajemenKelasModalProps> = ({ isOpen, onClose }) => {
  const { kelasList, loading, error, addKelas, updateKelas, deleteKelas } = useKelas();
  const { siswaList } = useSiswa();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<KelasFormValues>({
    resolver: zodResolver(kelasSchema),
    defaultValues: { nama: '', waliKelas: '', kontakWaliKelas: '' },
  });

  const handleResetForm = () => {
    reset({ nama: '', waliKelas: '', kontakWaliKelas: '' });
    setEditingId(null);
  };

  useEffect(() => {
    if (isOpen) {
      handleResetForm();
    }
  }, [isOpen, reset]);

  const handleEditClick = (kelas: Kelas) => {
    setEditingId(kelas.id);
    reset(kelas);
  };

  const studentCountByClass = useMemo(() => {
    const counts = new Map<string, number>();
    for (const siswa of siswaList) {
      const currentCount = counts.get(siswa.kelas) || 0;
      counts.set(siswa.kelas, currentCount + 1);
    }
    return counts;
  }, [siswaList]);

  const onSubmit: SubmitHandler<KelasFormValues> = async (data) => {
    try {
      if (editingId) {
        await updateKelas(editingId, data);
        toast.success(`Kelas "${data.nama}" berhasil diperbarui.`);
      } else {
        await addKelas(data);
        toast.success(`Kelas "${data.nama}" berhasil ditambahkan.`);
      }
      handleResetForm();
    } catch (e) {
      const action = editingId ? 'memperbarui' : 'menambahkan';
      toast.error(`Gagal ${action} kelas: ${e instanceof Error ? e.message : 'Error tidak diketahui'}`);
      console.error(e);
    }
  };

  const handleDeleteKelas = async (kelas: Kelas) => {
    const siswaInKelas = siswaList.filter(s => s.kelas === kelas.nama).length;
    if (siswaInKelas > 0) {
      toast.error(`Tidak dapat menghapus kelas "${kelas.nama}" karena masih ada ${siswaInKelas} siswa di dalamnya.`);
      return;
    }

    toast(
      (t) => (
        <div className="flex flex-col gap-4">
          <span>
            Apakah Anda yakin ingin menghapus kelas <strong>"{kelas.nama}"</strong>?
          </span>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => toast.dismiss(t.id)}>
              Batal
            </Button>
            <Button variant="danger" size="sm" onClick={async () => {
              toast.dismiss(t.id);
              await deleteKelas(kelas.id);
              toast.success(`Kelas "${kelas.nama}" berhasil dihapus.`);
            }}>
              Ya, Hapus
            </Button>
          </div>
        </div>
      ), { duration: 6000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Manajemen Kelas</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="w-5 h-5" /></Button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Form Section */}
          <form onSubmit={handleSubmit(onSubmit)} className="mb-8 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">{editingId ? 'Edit Kelas' : 'Tambah Kelas Baru'}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Kelas</label>
                <input {...register('nama')} placeholder="Contoh: 10-A" className={`input-field w-full ${errors.nama ? 'border-red-500' : ''}`} />
                {errors.nama && <p className="text-xs text-red-500 mt-1">{errors.nama.message}</p>}
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">Nama Wali Kelas</label>
                <input {...register('waliKelas')} placeholder="(Opsional)" className="input-field w-full" />
              </div>
              <div className="sm:col-span-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">No. WhatsApp Wali</label>
                <input {...register('kontakWaliKelas')} placeholder="Contoh: 628123..." className={`input-field w-full ${errors.kontakWaliKelas ? 'border-red-500' : ''}`} />
                {errors.kontakWaliKelas && <p className="text-xs text-red-500 mt-1">{errors.kontakWaliKelas.message}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              {editingId && (
                <Button type="button" variant="outline" onClick={handleResetForm}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Batal Edit
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting || !isDirty}>
                <Plus className="w-4 h-4 mr-2" /> {editingId ? 'Simpan Perubahan' : 'Tambah Kelas'}
              </Button>
            </div>
          </form>

          {/* List Section */}
          {loading && <p className="text-center text-gray-500">Memuat...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div className="space-y-2">
            {kelasList.map((k) => (
              <div key={k.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg group transition-colors ${editingId === k.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <div className="flex-1 mb-2 sm:mb-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>
                    <p className="font-semibold text-base text-gray-800">{k.nama}</p>
                    <p className="text-sm text-gray-500">
                      Wali: {k.waliKelas || '-'}
                    </p>
                    {k.kontakWaliKelas && (
                      <a 
                        href={`https://wa.me/${k.kontakWaliKelas}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-1"
                      >
                        <MessageCircle className="w-3 h-3" /> {k.kontakWaliKelas}
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                    <Users className="w-3 h-3" />
                    <span>{studentCountByClass.get(k.nama) || 0}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(k)} className="text-blue-500 hover:bg-blue-100">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteKelas(k)} className="text-red-500 hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      </div>
    </div>
  );
};

export default ManajemenKelasModal;