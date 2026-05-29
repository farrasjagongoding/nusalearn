import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { LayoutDashboard, FileText, MonitorPlay, LogOut, Menu, X, UserCircle } from 'lucide-react';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const { url, props: { auth } } = usePage<PageProps>();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => url.startsWith(path);

    const navLinks = [
        { name: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
        { name: 'Kuis Saya', href: '/teacher/quizzes', icon: FileText },
        { name: 'Kelas Virtual', href: '/teacher/classrooms', icon: MonitorPlay },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Topbar */}
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo Area */}
                        <div className="flex items-center gap-8">
                            <Link href="/teacher/dashboard" className="flex items-center gap-2">
                                <span className="text-2xl font-black text-indigo-600 tracking-tight">NusaLearn</span>
                                <span className="hidden sm:inline-flex px-2 py-1 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-widest">
                                    Guru
                                </span>
                            </Link>

                            {/* Desktop Nav */}
                            <div className="hidden md:flex items-center gap-1">
                                {navLinks.map((link) => (
                                    <Link key={link.name} href={link.href}
                                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                                            isActive(link.href) 
                                            ? 'text-indigo-600 bg-indigo-50' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`}>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* User Actions & Mobile Toggle */}
                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-semibold text-slate-700 pr-2">{auth.user.name}</span>
                                </button>

                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 py-2">
                                            <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                                <p className="text-sm font-bold text-slate-800 truncate">{auth.user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                            </div>
                                            <Link href="/logout" method="post" as="button" className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition">
                                                <LogOut className="w-4 h-4" /> Keluar Sistem
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-slate-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 shadow-lg space-y-1">
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${isActive(link.href) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}>
                                <link.icon className="w-5 h-5" /> {link.name}
                            </Link>
                        ))}
                        <div className="border-t border-slate-100 mt-4 pt-4">
                            <div className="flex items-center gap-3 px-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{auth.user.name}</p>
                                    <p className="text-xs text-slate-500">{auth.user.email}</p>
                                </div>
                            </div>
                            <Link href="/logout" method="post" as="button" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 bg-rose-50 rounded-xl">
                                <LogOut className="w-5 h-5" /> Keluar
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}