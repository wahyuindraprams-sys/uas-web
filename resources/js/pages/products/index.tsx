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
import * as products from '@/routes/products';

interface Product {
    id: number;
    kode_produk: string;
    nama_produk: string;
    harga: string;
    stok: number;
}

interface Props {
    products: Product[];
    errors?: { delete?: string };
}

export default function ProductIndex({ products: data, errors }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(products.destroy(deleteTarget.id).url, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    const columns = [
        { header: 'Kode Produk', accessorKey: 'kode_produk' as const },
        { header: 'Nama Produk', accessorKey: 'nama_produk' as const },
        {
            header: 'Harga',
            cell: (item: Product) =>
                new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                }).format(parseFloat(item.harga)),
        },
        { header: 'Stok', accessorKey: 'stok' as const },
        {
            header: 'Aksi',
            className: 'w-28 text-center',
            cell: (item: Product) => (
                <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => router.get(products.edit(item.id).url)}>
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
            <Head title="Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Data Produk</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Kelola seluruh data master produk Anda.
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
                            searchPlaceholder="Cari kode / nama produk..."
                            addLabel="Tambah Produk"
                            onAddClick={() => router.get(products.create().url)}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Produk</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus produk <strong>{deleteTarget?.nama_produk}</strong>?
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

ProductIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Produk', href: '/products' },
    ],
};
