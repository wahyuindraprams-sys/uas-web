import { Head, router } from '@inertiajs/react';
import { Eye, Pencil, Trash2 } from 'lucide-react';
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
import * as transactions from '@/routes/transactions';

interface Transaction {
    id: number;
    no_inv: string;
    kode_customer: string;
    nama_customer: string;
    tgl_inv: string;
    total: string;
}

interface Props {
    transactions: Transaction[];
}

const fmt = (v: string) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(parseFloat(v));

const fmtDate = (v: string) =>
    new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

export default function TransactionIndex({ transactions: data }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(transactions.destroy(deleteTarget.id).url, {
            onFinish: () => setDeleteTarget(null),
        });
    };

    const columns = [
        { header: 'No. Invoice', accessorKey: 'no_inv' as const },
        { header: 'Customer', accessorKey: 'nama_customer' as const },
        { header: 'Tanggal', cell: (item: Transaction) => fmtDate(item.tgl_inv) },
        {
            header: 'Total',
            cell: (item: Transaction) => (
                <span className="font-semibold text-blue-600">{fmt(item.total)}</span>
            ),
        },
        {
            header: 'Aksi',
            className: 'w-36 text-center',
            cell: (item: Transaction) => (
                <div className="flex justify-center gap-1.5">
                    <Button size="sm" variant="outline" onClick={() => router.get(transactions.show(item.id).url)}>
                        <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.get(transactions.edit(item.id).url)}>
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
            <Head title="Transaksi" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Data Transaksi</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Kelola seluruh transaksi penjualan Anda.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <AppDataTable
                            data={data}
                            columns={columns}
                            searchPlaceholder="Cari no. invoice / nama customer..."
                            addLabel="Tambah Transaksi"
                            onAddClick={() => router.get(transactions.create().url)}
                        />
                    </CardContent>
                </Card>
            </div>

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Transaksi</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus transaksi <strong>{deleteTarget?.no_inv}</strong>?
                            Stok produk akan dikembalikan otomatis.
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

TransactionIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transaksi', href: '/transactions' },
    ],
};
