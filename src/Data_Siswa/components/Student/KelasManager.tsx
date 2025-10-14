import React, { useEffect } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { Modal } from '@/Komponen';
import Button from '@/Komponen/Button';
import { Kelas } from '@/Data_Siswa/types/type';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface KelasManagerProps {
  isOpen: boolean;
  onClose: () => void;
  kelasList: Kelas[];
  onAddKelas: (nama: string, waliKelas?: string, kontakWaliKelas?: string) => Promise<void>;
  onDeleteKelas: (id: string) => Promise<void>;
  onUpdateKelas: (id: string, updates: Partial<Kelas>) => Promise<void>;
}

const addKelasSchema = z.object({
  nama: z.string().min(1, 'Nama kelas wajib diisi.'),
  waliKelas: z.string().optional(),
  kontakWaliKelas: z.string().optional(),
});


const validationSchema = z.object({
  kelolaKelas: z.object({
    newKelas: addKelasSchema,
  }),
});

type AddKelasFormValues = z.infer<typeof addKelasSchema>;

const KelasManager: React.FC<KelasManagerProps> = ({
  isOpen,
  onClose,
  kelasList,
  onAddKelas,
  onDeleteKelas,
  onUpdateKelas,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<{ kelolaKelas: { newKelas: AddKelasFormValues, kelasList: Kelas[] } }>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      kelolaKelas: {
        newKelas: { nama: '', waliKelas: '', kontakWaliKelas: '' },
        kelasList: [],
      }
    }
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "kelolaKelas.kelasList",
  });

  useEffect(() => {
    if (isOpen) {
      replace(kelasList);
      reset({
        kelolaKelas: {
          newKelas: { nama: '', waliKelas: '', kontakWaliKelas: '' },
          kelasList: kelasList,
        }
      });
    }
  }, [kelasList, isOpen, replace, reset]);

  const handleAddKelas = async (data: { kelolaKelas: { newKelas: AddKelasFormValues } }) => {
    const { newKelas } = data.kelolaKelas;
    await onAddKelas(newKelas.nama.trim(), newKelas.waliKelas?.trim(), newKelas.kontakWaliKelas?.trim());
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manajemen Kelas">
      <div className="space-y-4">
        <form onSubmit={handleSubmit(handleAddKelas)} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              {...register('kelolaKelas.newKelas.nama')}
              placeholder="Nama kelas baru..."
              className={`input-field flex-grow ${errors.kelolaKelas?.newKelas?.nama ? 'border-red-500' : ''}`}
            />
            <input
              type="text"
              {...register('kelolaKelas.newKelas.waliKelas')}
              placeholder="Nama Wali Kelas (opsional)"
              className="input-field flex-grow"
            />
            <input
              type="text"
              {...register('kelolaKelas.newKelas.kontakWaliKelas')}
              placeholder="No. Tlp Wali (opsional)"
              className="input-field flex-grow"
            />
          </div>
          {errors.kelolaKelas?.newKelas?.nama && <p className="text-sm text-red-500 -mt-2 mb-2">{errors.kelolaKelas.newKelas.nama.message}</p>}
          <Button type="submit" disabled={isSubmitting} fullWidth>
            <Plus className="mr-2 h-4 w-4" /> {isSubmitting ? 'Menambahkan...' : 'Tambah Kelas'}
          </Button>
        </form>

        {/* Daftar Kelas */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
          {kelasList.length > 0 ? (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-lg gap-2"
              >
                <span className="font-medium text-gray-800 dark:text-gray-200">{field.nama}</span>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    {...register(`kelolaKelas.kelasList.${index}.waliKelas`)}
                    placeholder="Wali Kelas"
                    className="input-field flex-grow text-sm"
                  />
                  <input
                    type="text"
                    {...register(`kelolaKelas.kelasList.${index}.kontakWaliKelas`)}
                    placeholder="No. Telepon"
                    className="input-field flex-grow text-sm"
                  />
                  <Button variant="ghost" size="sm" onClick={() => {
                    const updatedKelas = control._getWatch('kelolaKelas.kelasList')[index];
                    onUpdateKelas(field.id, { waliKelas: updatedKelas.waliKelas, kontakWaliKelas: updatedKelas.kontakWaliKelas });
                  }}><Save className="h-4 w-4" /></Button>
                  <Button variant="danger" size="sm" onClick={() => onDeleteKelas(field.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Belum ada kelas.</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default KelasManager;