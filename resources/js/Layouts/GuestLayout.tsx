import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { BookOpen } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        // Memastikan selalu flex-col, item di tengah, dan memiliki padding (p-4) agar tidak menabrak layar HP
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 sm:p-0">
            
            {/* Wrapper pembatas lebar agar logo dan form sejajar */}
            <div className="w-full max-w-md">
                
                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2 hover:scale-105 transition-transform">
                        <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-3xl font-black text-slate-900 tracking-tight">NusaLearn</span>
                    </Link>
                </div>

                {/* Card Section: rounded-3xl diaplikasikan untuk semua ukuran layar */}
                <div className="w-full bg-white px-6 py-8 sm:px-8 sm:py-10 shadow-xl shadow-slate-200/50 border border-slate-200 rounded-3xl">
                    {children}
                </div>
                
            </div>
        </div>
    );
}