import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, Sector } from 'recharts';
import { Users, BarChart3 } from 'lucide-react';
import { Siswa } from '@/Data_Siswa/types/type';

const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28', '#A28DFF', '#FF82A9'];

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-bold">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-sm">{`${value} Siswa`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

interface GrafikSiswaProps {
  siswaList: Siswa[];
  isLoading: boolean;
}

const GrafikSiswa: React.FC<GrafikSiswaProps> = ({ siswaList, isLoading }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const genderData = useMemo(() => {
    const lakiLaki = siswaList.filter(s => s.jenisKelamin === 'Laki-laki').length;
    const perempuan = siswaList.filter(s => s.jenisKelamin === 'Perempuan').length;
    return [
      { name: 'Laki-laki', value: lakiLaki },
      { name: 'Perempuan', value: perempuan },
    ];
  }, [siswaList]);

  const kelasData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    for (const siswa of siswaList) {
      counts[siswa.kelas] = (counts[siswa.kelas] || 0) + 1;
    }
    return Object.entries(counts).map(([name, value]) => ({ name, jumlah: value })).sort((a, b) => a.name.localeCompare(b.name));
  }, [siswaList]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6 flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
        <div className="lg:col-span-3 bg-white rounded-xl shadow-soft p-6 flex items-center justify-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Pie Chart - Komposisi Gender */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-primary-500 mr-3" />
            <h3 className="text-lg font-semibold text-slate-800">Komposisi Gender Siswa</h3>
        </div>
        {/* Hapus div dengan style dan ResponsiveContainer */}
        <PieChart width={400} height={300}>
            <Pie 
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onMouseEnter={onPieEnter}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
        </PieChart>
      </div>

      {/* Bar Chart - Jumlah Siswa per Kelas */}
      <div className="lg:col-span-3 bg-white rounded-xl shadow-soft p-6">
        <div className="flex items-center mb-4">
            <BarChart3 className="h-6 w-6 text-primary-500 mr-3" />
            <h3 className="text-lg font-semibold text-slate-800">Jumlah Siswa per Kelas</h3>
        </div>
        {/* Hapus div dengan style dan ResponsiveContainer */}
        <BarChart width={600} height={300} data={kelasData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip cursor={{fill: 'rgba(240, 240, 240, 0.5)'}} contentStyle={{fontSize: '14px', borderRadius: '0.5rem'}}/>
          <Legend wrapperStyle={{fontSize: '14px'}}/>
          <Bar dataKey="jumlah" name="Jumlah Siswa" fill="#8884d8" radius={[4, 4, 0, 0]}>
            {kelasData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </div>
    </div>
  );
};

export default GrafikSiswa;