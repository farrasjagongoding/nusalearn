import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { User } from '@/types';
import { Plus, Edit2, Trash2, X, ShieldCheck, GraduationCap, User as UserIcon } from 'lucide-react';

interface Props {
    users: { data: User[] };
    flash?: { success?: string };
}

export default function Index({ users, flash }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'student',
        school: '',
        level_school: '',
    });

    const openModal = (user: User | null = null) => {
        clearErrors();
        setEditingUser(user);
        if (user) {
            setData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                school: user.school || '',
                level_school: user.level_school || '',
            });
        } else {
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            reset();
            setEditingUser(null);
            clearErrors();
        }, 300);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, { onSuccess: () => closeModal() });
        } else {
            post('/admin/users', { onSuccess: () => closeModal() });
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('Hapus user ini secara permanen?')) {
            router.delete(`/admin/users/${id}`);
        }
    };

    const RoleBadge = ({ role }: { role: string }) => {
        if (role === 'admin') return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md"><ShieldCheck className="w-3 h-3" /> Admin</span>;
        if (role === 'teacher') return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md"><GraduationCap className="w-3 h-3" /> Guru</span>;
        return <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md"><UserIcon className="w-3 h-3" /> Siswa</span>;
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />

            {flash?.success && (
                <div className="mb-6 bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> {flash.success}
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">Kelola akses, role, dan data personal pengguna sistem.</p>
                </div>
                <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition shadow-sm">
                    <Plus className="w-5 h-5" /> Tambah User
                </button>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Akses (Role)</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sekolah</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Belum ada data pengguna.</td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm border border-slate-200">
                                                    {user.name[0].toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap"><RoleBadge role={user.role} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-500">{user.school || '-'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => openModal(user)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit User">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteUser(user.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Hapus User">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tetap Sama Secara Logika, Hanya Dipercantik */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800">
                                {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                            </h2>
                            <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Nama Lengkap</label>
                                <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition" />
                                {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Alamat Email</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} required
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition" />
                                {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email}</p>}
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Password</label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} required={!editingUser}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition" />
                                    {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password}</p>}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Akses (Role)</label>
                                <select value={data.role} onChange={e => setData('role', e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition bg-white">
                                    <option value="student">Siswa (Student)</option>
                                    <option value="teacher">Guru (Teacher)</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Sekolah</label>
                                    <input type="text" value={data.school} onChange={e => setData('school', e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition" placeholder="Opsional" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5">Jenjang</label>
                                    <select value={data.level_school} onChange={e => setData('level_school', e.target.value)}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-800 transition bg-white">
                                        <option value="">- Pilih -</option>
                                        <option value="SD">SD</option>
                                        <option value="SMP">SMP</option>
                                        <option value="SMA">SMA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-6">
                                <button type="button" onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2">
                                    {processing ? 'Menyimpan...' : (editingUser ? <><Edit2 className="w-4 h-4" /> Simpan Perubahan</> : <><Plus className="w-4 h-4" /> Tambah User</>)}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}