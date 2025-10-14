import React, { useState } from 'react';
import { FaLock, FaSchool, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '@/Komponen/Button';
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    setError('');

    // --- Logika Login Sederhana (Contoh) ---
    // Di aplikasi nyata, ini akan memanggil API
    if (data.username === 'admin' && data.password === 'admin123') {
      // Simpan status login dan role admin
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'admin');
      toast.success('Selamat datang, Admin!', {
        duration: 4000,
        icon: <FaExclamationTriangle className="text-yellow-500" />
      });
      navigate('/dashboard');
    } else if (data.username === 'user' && data.password === 'user123') {
      // Simpan status login untuk user biasa
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'user');
      navigate('/dashboard');
    } else {
      setError('Username atau password salah!');
    }
  };

  const handleBypass = () => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', 'admin');
    toast.success('Selamat datang, Admin!', {
      duration: 4000,
      icon: <FaExclamationTriangle className="text-yellow-500" />
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="p-4 bg-blue-100 rounded-full mb-3">
              <FaSchool className="text-4xl text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Sekolah</h1>
            <p className="text-slate-500 text-sm mt-1">Silakan masuk untuk melanjutkan</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <FaUser className="text-slate-400" />
                <input 
                  type="text" 
                  className="grow" 
                  placeholder="Username (admin/user)" 
                  {...register('username')}
                />
              </label>
              {errors.username && <p className="text-error text-sm mt-1">{errors.username.message}</p>}
            </div>
            <div className="form-control">
              <label className="input input-bordered flex items-center gap-2">
                <FaLock className="text-slate-400" />
                <input 
                  type="password" 
                  className="grow" 
                  placeholder="Password (admin123/user123)" 
                  {...register('password')}
                />
              </label>
              {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
            </div>
            {error && <div className="text-error text-sm text-center pt-2">{error}</div>}
            <div className="form-control pt-4">
              <Button type="submit" className="w-full">Login</Button>
            </div>
            <div className="divider text-xs">atau</div>
            <div className="form-control">
              <Button type="button" onClick={handleBypass} variant="ghost" className="w-full">Masuk (Bypass)</Button>
            </div>
          </form>
          
          {/* Info Login */}
          <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <p className="font-medium mb-1">Informasi Login:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Admin: admin / admin123</li>
              <li>User: user / user123</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;