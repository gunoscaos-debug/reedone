import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import Button from '@/Komponen/Button';
import { useGuruData } from '../hooks/useGuruData';
import toast from 'react-hot-toast';

const initialScheduleData = {
  senin: [
    { startTime: '07:00', endTime: '08:30', subject: 'Matematika', class: 'Kelas 10A' },
    { startTime: '09:00', endTime: '10:30', subject: 'Fisika', class: 'Kelas 11B' },
  ],
  selasa: [
    { startTime: '07:00', endTime: '08:30', subject: 'Kimia', class: 'Kelas 12C' },
  ],
  rabu: [
    { startTime: '09:00', endTime: '10:30', subject: 'Biologi', class: 'Kelas 10A' },
  ],
  kamis: [],
  jumat: [
    { startTime: '07:00', endTime: '08:30', subject: 'Matematika', class: 'Kelas 11B' },
    { startTime: '09:00', endTime: '10:30', subject: 'Fisika', class: 'Kelas 12C' },
  ],
  sabtu: [],
};

type Day = keyof typeof initialScheduleData;

// Tipe untuk satu item jadwal
type ScheduleItem = { startTime: string; endTime: string; subject: string; class: string; }; // Data yang disimpan
type EditableScheduleItem = ScheduleItem & { _id: string }; // Data saat diedit

type ScheduleData = Record<Day, ScheduleItem[]>;
type EditableScheduleData = Record<Day, EditableScheduleItem[]>;

interface JadwalPelajaranProps {
  kelasOptions: string[];
  isLoading: boolean;
}

const JadwalPelajaran: React.FC<JadwalPelajaranProps> = ({ kelasOptions, isLoading }) => {
  const { schedule, updateSchedule, isUpdatingSchedule } = useGuruData();
  const [scheduleData, setScheduleData] = useState<ScheduleData>(initialScheduleData);
  const [activeDay, setActiveDay] = useState<Day>('senin');
  const [isEditing, setIsEditing] = useState(false);
  const [tempScheduleData, setTempScheduleData] = useState<EditableScheduleData>(initialScheduleData as EditableScheduleData);

  useEffect(() => {
    if (schedule) {
      // Gabungkan data dari DB dengan struktur awal untuk memastikan semua hari ada
      const fullSchedule = { ...initialScheduleData, ...schedule };
      setScheduleData(fullSchedule);
    }
  }, [schedule]);

  const days: Day[] = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

  const handleEdit = useCallback(() => {
    // Tambahkan ID unik sementara untuk setiap item saat masuk mode edit
    const editableData = Object.entries(scheduleData).reduce((acc, [day, items]) => {
      acc[day as Day] = items.map(item => ({ ...item, _id: crypto.randomUUID() }));
      return acc;
    }, {} as EditableScheduleData);
    setTempScheduleData(editableData);
    setIsEditing(true);
  }, [scheduleData]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      // Hapus ID sementara sebelum menyimpan
      const dataToSave = Object.entries(tempScheduleData).reduce((acc, [day, items]) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        acc[day as Day] = items.map(({ _id, ...rest }) => rest); 
        return acc;
      }, {} as ScheduleData);

      await updateSchedule(dataToSave);
      toast.success('Jadwal berhasil disimpan.');
      setIsEditing(false);
    } catch {
      toast.error('Gagal menyimpan jadwal.');
    }
  }, [tempScheduleData, updateSchedule]);

  const handleScheduleChange = useCallback((day: Day, id: string, field: keyof ScheduleItem, value: string) => {
    const newSchedule = { ...tempScheduleData };
    const itemIndex = newSchedule[day].findIndex(item => item._id === id);
    if (itemIndex > -1) {
      newSchedule[day][itemIndex] = { ...newSchedule[day][itemIndex], [field]: value };
      setTempScheduleData(newSchedule);
    }
  }, [tempScheduleData]);

  const addScheduleItem = useCallback((day: Day) => {
    const newSchedule = { ...tempScheduleData };
    newSchedule[day].push({ _id: crypto.randomUUID(), startTime: '', endTime: '', subject: '', class: '' });
    setTempScheduleData(newSchedule);
  }, [tempScheduleData]);

  const removeScheduleItem = useCallback((day: Day, id: string) => {
    const newSchedule = { ...tempScheduleData };
    newSchedule[day] = newSchedule[day].filter(item => item._id !== id);
    setTempScheduleData(newSchedule);
  }, [tempScheduleData]);

  return (
    <div className="bg-white rounded-xl shadow-soft p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-primary-500 mr-3" />
          <h2 className="text-xl font-bold text-slate-800">Jadwal Pelajaran</h2>
        </div>
        <div>
          {isEditing ? (
            <div className="flex space-x-2">
              <Button onClick={handleCancel} variant="outline" size="sm" disabled={isUpdatingSchedule}>
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave} size="sm" disabled={isUpdatingSchedule}>
                {isUpdatingSchedule ? 'Menyimpan...' : <><Save className="h-4 w-4 mr-2" /> Simpan</>}
              </Button>
            </div>
          ) : (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Jadwal
            </Button>
          )}
        </div>
      </div>

      <div className="border-b border-slate-200 mb-4">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setActiveDay(day)}
              className={`${
                activeDay === day
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize`}
              disabled={isEditing}
            >
              {day}
            </button>
          ))}
        </nav>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}

      {!isLoading && (
      <div>
        {isEditing ? (
          <div className="space-y-4">
            {tempScheduleData[activeDay].map((item) => (              
              <div key={item._id} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center gap-2 md:col-span-2">
                  <div>
                    <label className="text-xs text-slate-500">Mulai</label>
                    <input type="time" value={item.startTime} onChange={(e) => handleScheduleChange(activeDay, item._id, 'startTime', e.target.value)} className="input-field w-full" />
                  </div>
                  <span className="pt-5 text-slate-400">-</span>
                  <div>
                    <label className="text-xs text-slate-500">Selesai</label>
                    <input type="time" value={item.endTime} onChange={(e) => handleScheduleChange(activeDay, item._id, 'endTime', e.target.value)} className="input-field w-full" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Mata Pelajaran"
                  value={item.subject}
                  onChange={(e) => handleScheduleChange(activeDay, item._id, 'subject', e.target.value)}
                  className="input-field md:col-span-1 mt-5 md:mt-0"
                />
                <select
                  value={item.class}
                  onChange={(e) => handleScheduleChange(activeDay, item._id, 'class', e.target.value)}
                  className="input-field mt-5 md:mt-0"
                >
                  <option value="">Pilih Kelas</option>
                  {kelasOptions.map((kelas) => (
                    <option key={kelas} value={kelas}>
                      {kelas}
                    </option>
                  ))}
                </select>
                <Button onClick={() => removeScheduleItem(activeDay, item._id)} variant="danger" size="icon" aria-label="Hapus jadwal">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button onClick={() => addScheduleItem(activeDay)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jadwal
            </Button>
          </div>
        ) : scheduleData[activeDay].length > 0 ? (
          <ul className="space-y-4">
            {scheduleData[activeDay].map((item, index) => (
              <li key={index} className="p-4 bg-slate-50 rounded-lg flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-slate-400" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold text-slate-800">{item.subject}</p>
                  <p className="text-sm text-slate-500">{item.class}</p>
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {item.startTime && item.endTime ? `${item.startTime} - ${item.endTime}` : 'Waktu belum diatur'}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">Tidak ada jadwal untuk hari ini.</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

export default JadwalPelajaran;