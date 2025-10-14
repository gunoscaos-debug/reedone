import React from 'react';

interface Grades {
  [studentId: string]: {
    [subjectId: string]: {
      nh_ganjil: number | null;
      sts_ganjil: number | null;
      sas_ganjil: number | null;
      praktik_ganjil: number | null;
      nh_genap: number | null;
      sts_genap: number | null;
      sas_genap: number | null;
      praktik_genap: number | null;
      catatan_baik: string;
      catatan_perlu_ditingkatkan: string;
    }
  };
}

interface GradeTableProps {
  subjects: { id: string; name: string }[];
  grades: Grades;
  selectedStudentId: string;
  handleGradeChange: (subjectId: string, field: string, value: string) => void;
  onUpdateGrade: (studentId: string, subjectId: number, field: string, value: string) => void;
}

const GradeTable: React.FC<GradeTableProps> = ({ subjects, grades, selectedStudentId, handleGradeChange, onUpdateGrade }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Penilaian</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Mata Pelajaran
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                NH Ganjil
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                STS Ganjil
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SAS Ganjil
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Praktik Ganjil
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                NH Genap
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                STS Genap
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                SAS Genap
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Praktik Genap
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {subjects.map((subject) => {
              const studentGrades = grades[selectedStudentId]?.[subject.id!] || {
                nh_ganjil: null,
                sts_ganjil: null,
                sas_ganjil: null,
                praktik_ganjil: null,
                nh_genap: null,
                sts_genap: null,
                sas_genap: null,
                praktik_genap: null,
                catatan_baik: '',
                catatan_perlu_ditingkatkan: ''
              };
              
              return (
                <tr key={subject.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{subject.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.nh_ganjil ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'nh_ganjil', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.sts_ganjil ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'sts_ganjil', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.sas_ganjil ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'sas_ganjil', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.praktik_ganjil ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'praktik_ganjil', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.nh_genap ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'nh_genap', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.sts_genap ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'sts_genap', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.sas_genap ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'sas_genap', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studentGrades.praktik_genap ?? ''}
                      onChange={(e) => handleGradeChange(subject.id!, 'praktik_genap', e.target.value)}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="-"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Catatan Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Catatan Guru</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan Baik
              </label>
              <textarea
                value={grades[selectedStudentId]?.[0]?.catatan_baik || ''}
                onChange={(e) => onUpdateGrade && onUpdateGrade(selectedStudentId, 0, 'catatan_baik', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tuliskan hal-hal positif mengenai siswa..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Catatan yang Perlu Ditingkatkan
              </label>
              <textarea
                value={grades[selectedStudentId]?.[0]?.catatan_perlu_ditingkatkan || ''}
                onChange={(e) => onUpdateGrade && onUpdateGrade(selectedStudentId, 0, 'catatan_perlu_ditingkatkan', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tuliskan hal-hal yang perlu ditingkatkan..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeTable;