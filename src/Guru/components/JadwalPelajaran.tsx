import React, { useState } from 'react';
import { Calendar, Clock, Edit, Save, X, Plus, Trash2 } from 'lucide-react';
import Button from '@/Komponen/Button';

const initialScheduleData = {
  senin: [
    { time: '07:00 - 08:30', subject: 'Matematika', class: 'Kelas 10A' },
    { time: '09:00 - 10:30', subject: 'Fisika', class: 'Kelas 11B' },
  ],
  selasa: [
    { time: '07:00 - 08:30', subject: 'Kimia', class: 'Kelas 12C' },
  ],
  rabu: [
    { time: '09:00 - 10:30', subject: 'Biologi', class: 'Kelas 10A' },
  ],
  kamis: [],
  jumat: [
    { time: '07:00 - 08:30', subject: 'Matematika', class: 'Kelas 11B' },
    { time: '09:00 - 10:30', subject: 'Fisika', class: 'Kelas 12C' },
  ],
  sabtu: [],
};

type Day = keyof typeof initialScheduleData;

const JadwalPelajaran: React.FC = () => {
  const [scheduleData, setScheduleData] = useState(initialScheduleData);
  const [activeDay, setActiveDay] = useState<Day>('senin');
  const [isEditing, setIsEditing] = useState(false);
  const [tempScheduleData, setTempScheduleData] = useState(initialScheduleData);

  const days: Day[] = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu'];

  const handleEdit = () => {
    setTempScheduleData(scheduleData);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setScheduleData(tempScheduleData);
    setIsEditing(false);
  };

  const handleScheduleChange = (day: Day, index: number, field: string, value: string) => {
    const newSchedule = { ...tempScheduleData };
    newSchedule[day][index] = { ...newSchedule[day][index], [field]: value };
    setTempScheduleData(newSchedule);
  };

  const addScheduleItem = (day: Day) => {
    const newSchedule = { ...tempScheduleData };
    newSchedule[day].push({ time: '', subject: '', class: '' });
    setTempScheduleData(newSchedule);
  };

  const removeScheduleItem = (day: Day, index: number) => {
    const newSchedule = { ...tempScheduleData };
    newSchedule[day].splice(index, 1);
    setTempScheduleData(newSchedule);
  };

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
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-2" />
                Batal
              </Button>
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-2" />
                Simpan
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

      <div>
        {isEditing ? (
          <div className="space-y-4">
            {tempScheduleData[activeDay].map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                <input
                  type="text"
                  placeholder="Waktu (cth: 07:00 - 08:30)"
                  value={item.time}
                  onChange={(e) => handleScheduleChange(activeDay, index, 'time', e.target.value)}
                  className="input-field"
                />
                <input
                  type="text"
                  placeholder="Mata Pelajaran"
                  value={item.subject}
                  onChange={(e) => handleScheduleChange(activeDay, index, 'subject', e.target.value)}
                  className="input-field md:col-span-1"
                />
                <input
                  type="text"
                  placeholder="Kelas"
                  value={item.class}
                  onChange={(e) => handleScheduleChange(activeDay, index, 'class', e.target.value)}
                  className="input-field"
                />
                <Button onClick={() => removeScheduleItem(activeDay, index)} variant="danger" size="icon">
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
                  {item.time}
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
    </div>
  );
};

export default JadwalPelajaran;