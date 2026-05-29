import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { UserCircle } from 'lucide-react';

// 1. Pindahkan tipe data ke dalam interface terpisah untuk mencegah error TS
interface Props extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({ mustVerifyEmail, status }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-black leading-tight text-slate-900 tracking-tight flex items-center gap-2">
                    <UserCircle className="w-6 h-6 text-indigo-600" /> Profil Saya
                </h2>
            }
        >
            <Head title="Profil Saya" />

            {/* Tambahkan background slate-50 agar menyatu dengan tema aplikasi */}
            <div className="py-10 bg-slate-50 min-h-screen">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    
                    {/* Kotak Info Profil */}
                    <div className="bg-white p-6 shadow-sm border border-slate-200 sm:rounded-3xl sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    {/* Kotak Ubah Password */}
                    <div className="bg-white p-6 shadow-sm border border-slate-200 sm:rounded-3xl sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    {/* Kotak Hapus Akun (Diberi aksen kemerahan) */}
                    <div className="bg-white p-6 shadow-sm border border-rose-100 sm:rounded-3xl sm:p-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}