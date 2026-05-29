import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login({ status, canResetPassword }: { status?: string; canResetPassword: boolean }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Selamat Datang Kembali</h2>
                <p className="text-slate-500 text-sm font-medium mt-2">Masuk ke akun Anda untuk melanjutkan belajar.</p>
            </div>

            {status && <div className="mb-6 text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-100">{status}</div>}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">Alamat Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="email" type="email" name="email" value={data.email} autoComplete="username" autoFocus required
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="nama@email.com" />
                    </div>
                    <InputError message={errors.email} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">Kata Sandi</label>
                        {canResetPassword && (
                            <Link href={route('password.request')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition">Lupa Sandi?</Link>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <input id="password" type="password" name="password" value={data.password} autoComplete="current-password" required
                            onChange={(e) => setData('password', e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white text-slate-900 font-bold transition-all outline-none"
                            placeholder="••••••••" />
                    </div>
                    <InputError message={errors.password} className="mt-2 text-rose-500 font-bold text-xs" />
                </div>

                <div className="flex items-center pt-2">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox name="remember" checked={data.remember} onChange={(e) => setData('remember', (e.target.checked || false) as false)}
                            className="w-5 h-5 border-slate-300 text-indigo-600 focus:ring-indigo-600 rounded" />
                        <span className="ms-3 text-sm font-bold text-slate-600">Ingat Saya</span>
                    </label>
                </div>

                <button disabled={processing} type="submit"
                    className="w-full mt-8 flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50">
                    <LogIn className="w-5 h-5" /> {processing ? 'Memproses...' : 'Masuk ke Sistem'}
                </button>

                <p className="text-center text-sm font-medium text-slate-500 mt-6">
                    Belum punya akun? <Link href={route('register')} className="text-indigo-600 font-bold hover:text-indigo-800 transition">Daftar Sekarang</Link>
                </p>
            </form>
        </GuestLayout>
    );
}