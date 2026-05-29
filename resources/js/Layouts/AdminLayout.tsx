import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState } from 'react';
import { LayoutDashboard, Users, BookOpen, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { url, props: { auth } } = usePage<PageProps>();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Fungsi pembantu untuk mengecek URL aktif
    const isActive = (path: string) => url.startsWith(path);

    const navLinks = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Pengguna', href: '/admin/users', icon: Users },
        { name: 'Mata Pelajaran', href: '/admin/subjects', icon: BookOpen },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Mobile Topbar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-30 flex items-center justify-between px-4">
                <span className="text-xl font-black text-indigo-600 tracking-tight">NusaLearn</span>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Backdrop untuk Mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                    <div>
                        <span className="text-2xl font-black text-indigo-600 tracking-tight">NusaLearn</span>
                        <span className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admin</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        const active = isActive(link.href);
                        return (
                            <Link key={link.name} href={link.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    active 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}>
                                <Icon className={`w-5 h-5 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-50 mb-3 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {auth.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{auth.user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                        </div>
                    </div>
                    <Link href="/logout" method="post" as="button" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition">
                        <LogOut className="w-4 h-4" /> Keluar
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0">
                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}