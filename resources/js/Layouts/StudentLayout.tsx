import { Link, usePage, router } from '@inertiajs/react';
import { PageProps, StudentPoint } from '@/types';
import { useState } from 'react';
import { LayoutDashboard, PenTool, TrendingUp, Compass, LogOut, Menu, X, Shield, Star } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    point?: StudentPoint;
}

export default function StudentLayout({ children, point }: Props) {
    const { url, props: { auth } } = usePage<PageProps>();
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path: string) => url.startsWith(path);

    const navLinks = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Kuis', href: '/student/quizzes', icon: PenTool },
        { name: 'Progres', href: '/student/progress', icon: TrendingUp },
        { name: 'Jelajahi', href: '/browse', icon: Compass },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo & Desktop Nav */}
                        <div className="flex items-center gap-8">
                            <Link href="/student/dashboard" className="flex items-center gap-2">
                                <span className="text-2xl font-black text-indigo-600 tracking-tight">NusaLearn</span>
                            </Link>
                            <div className="hidden lg:flex items-center gap-2">
                                {navLinks.map((link) => (
                                    <Link key={link.name} href={link.href}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                            isActive(link.href) 
                                            ? 'text-indigo-600 bg-indigo-50' 
                                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                        }`}>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Point Badge & User */}
                        <div className="flex items-center gap-3 md:gap-5">
                            {point && (
                                <div className="hidden md:flex items-center gap-3 bg-amber-50 border border-amber-100 pl-1 pr-4 py-1 rounded-full shadow-sm">
                                    <div className="bg-amber-400 p-1.5 rounded-full shadow-inner text-white">
                                        <Star className="w-4 h-4 fill-current" />
                                    </div>
                                    <span className="text-amber-700 font-black text-sm tracking-wide">
                                        {point.total_points} PT
                                    </span>
                                    <div className="w-px h-4 bg-amber-200 mx-1"></div>
                                    <div className="flex items-center gap-1.5 text-indigo-600">
                                        <Shield className="w-4 h-4" />
                                        <span className="font-bold text-sm">Lv.{point.level}</span>
                                    </div>
                                </div>
                            )}

                            <div className="relative hidden md:block">
                                <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:opacity-80 transition focus:outline-none">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center font-bold text-white shadow-md">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>

                                {menuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                        <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                                            <div className="bg-slate-50 px-4 py-4 border-b border-slate-100">
                                                <p className="text-sm font-black text-slate-800 truncate">{auth.user.name}</p>
                                                <p className="text-xs font-medium text-slate-500 truncate">{auth.user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link href="/profile" className="block px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition">Profil Saya</Link>
                                                <button onClick={() => router.post('/logout')} className="w-full text-left px-4 py-2 mt-1 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition">Keluar</button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-6 shadow-xl space-y-1">
                        {point && (
                            <div className="flex items-center justify-between p-4 mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-2 text-amber-700">
                                    <Star className="w-5 h-5 fill-current" />
                                    <span className="font-black">{point.total_points} Poin</span>
                                </div>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold">
                                    <Shield className="w-5 h-5" /> Level {point.level}
                                </div>
                            </div>
                        )}
                        {navLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold ${isActive(link.href) ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <link.icon className="w-5 h-5" /> {link.name}
                            </Link>
                        ))}
                        <div className="h-px bg-slate-100 my-4" />
                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Profil Saya</Link>
                        <button onClick={() => router.post('/logout')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 bg-rose-50">
                            <LogOut className="w-5 h-5" /> Keluar
                        </button>
                    </div>
                )}
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
                {children}
            </main>
        </div>
    );
}