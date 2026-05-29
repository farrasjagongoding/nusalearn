import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Lock, User, UserPlus } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), { onFinish: () => reset('password', 'password_confirmation') });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Buat Akun Baru</h2>
                <p className="text-slate-500 text-sm font-medium mt-2">Bergabunglah dan mulai petualangan belajarmu.</p>
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Nama Lengkap</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="name" name="name" value={data.name} autoComplete="name" autoFocus required
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="Budi Santoso" />
                    </div>
                    <InputError message={errors.name} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Alamat Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="email" type="email" name="email" value={data.email} autoComplete="username" required
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="nama@email.com" />
                    </div>
                    <InputError message={errors.email} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Kata Sandi</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="password" type="password" name="password" value={data.password} autoComplete="new-password" required
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="••••••••" />
                    </div>
                    <InputError message={errors.password} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Konfirmasi Sandi</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="password_confirmation" type="password" name="password_confirmation" value={data.password_confirmation} autoComplete="new-password" required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="••••••••" />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <button disabled={processing} type="submit"
                    className="w-full mt-8 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50">
                    <UserPlus className="w-5 h-5" /> {processing ? 'Memproses...' : 'Daftar Sekarang'}
                </button>

                <p className="text-center text-sm font-medium text-slate-500 mt-6">
                    Sudah punya akun? <Link href={route('login')} className="text-indigo-600 font-bold hover:text-indigo-800 transition">Masuk di sini</Link>
                </p>
            </form>
        </GuestLayout>
    );
}