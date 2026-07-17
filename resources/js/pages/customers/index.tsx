import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { AppDataTable } from '@/components/app-data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import * as customers from '@/routes/customers';

interface Customer {
    id: number;
    kode_customer: string;
    nama_customer: string;
    alamat: string | null;
    provinsi: string | null;
    kota: string | null;
    kecamatan: string | null;
    kelurahan: string | null;
    kode_pos: string | null;
}

interface Props {
    customers: Customer[];
    errors?: { delete?: string };
}

export default function CustomerIndex({ customers: data, errors }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(customers.destroy(deleteTarget.id).url, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    const columns = [
        { header: 'Kode Customer', accessorKey: 'kode_customer' as const },
        { header: 'Nama Customer', accessorKey: 'nama_customer' as const },
        { header: 'Kota', accessorKey: 'kota' as const },
        { header: 'Provinsi', accessorKey: 'provinsi' as const },
        { header: 'Kode Pos', accessorKey: 'kode_pos' as const },
        {
            header: 'Aksi',
            className: 'w-28 text-center',
            cell: (item: Customer) => (
                <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.get(customers.edit(item.id).url)}>
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setDeleteTarget(item)}>
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Customer" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Data Customer</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Kelola seluruh data master customer Anda.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        {errors?.delete && (
                            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {errors.delete}
                            </div>
                        )}
                        <AppDataTable
                            data={data}
                            columns={columns}
                            searchPlaceholder="Cari kode / nama customer..."
                            addLabel="Tambah Customer"
                            onAddClick={() => router.get(customers.create().url)}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Customer</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus customer <strong>{deleteTarget?.nama_customer}</strong>?
                            Aksi ini tidak dapat dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Batal</Button>
                        <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

CustomerIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customer', href: '/customers' },
    ],
};
