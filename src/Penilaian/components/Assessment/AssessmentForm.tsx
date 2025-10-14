import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/Komponen/Button';

const assessmentSchema = z.object({
  nh_ganjil: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0, "Nilai harus antara 0 dan 100").max(100, "Nilai harus antara 0 dan 100").nullable()
  ),
  sts_ganjil: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).max(100).nullable()
  ),
  sas_ganjil: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).max(100).nullable()
  ),
  nh_genap: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).max(100).nullable()
  ),
  sts_genap: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).max(100).nullable()
  ),
  sas_genap: z.preprocess(
    (val) => (val === '' ? null : Number(val)),
    z.number().min(0).max(100).nullable()
  ),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  studentName: string;
  subject: string;
  initialData?: AssessmentFormValues;
  onSubmit: (data: AssessmentFormValues) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ studentName, subject, initialData, onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: initialData || {
      nh_ganjil: null,
      sts_ganjil: null,
      sas_ganjil: null,
      nh_genap: null,
      sts_genap: null,
      sas_genap: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-soft p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
          Penilaian untuk {studentName} - {subject}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Semester Ganjil */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Semester Ganjil</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nilai Harian
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('nh_ganjil')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.nh_ganjil ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.nh_ganjil && <p className="mt-1 text-sm text-red-500">{errors.nh_ganjil.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  STS (Sumatif Tengah Semester)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('sts_ganjil')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.sts_ganjil ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.sts_ganjil && <p className="mt-1 text-sm text-red-500">{errors.sts_ganjil.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SAS (Sumatif Akhir Semester)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('sas_ganjil')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.sas_ganjil ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.sas_ganjil && <p className="mt-1 text-sm text-red-500">{errors.sas_ganjil.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Semester Genap */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Semester Genap</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nilai Harian
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('nh_genap')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.nh_genap ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.nh_genap && <p className="mt-1 text-sm text-red-500">{errors.nh_genap.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  STS (Sumatif Tengah Semester)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('sts_genap')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.sts_genap ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.sts_genap && <p className="mt-1 text-sm text-red-500">{errors.sts_genap.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  SAS (Sumatif Akhir Semester)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register('sas_genap')}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white ${errors.sas_genap ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                  placeholder="0-100"
                />
                {errors.sas_genap && <p className="mt-1 text-sm text-red-500">{errors.sas_genap.message}</p>}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <Button type="submit" variant="primary">
            Simpan Nilai
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AssessmentForm;