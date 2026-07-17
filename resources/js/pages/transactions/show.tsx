import { Head, router } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import * as transactions from '@/routes/transactions';

interface TransactionDetail {
    id: number; kode_produk: string; nama_produk: string; qty: number;
    harga: string; disc1: string; disc2: string; disc3: string; harga_net: string; jumlah: string;
}
interface Transaction {
    id: number; no_inv: string; kode_customer: string; nama_customer: string;
    alamat_customer: string | null; tgl_inv: string; total: string; details: TransactionDetail[];
}

const fmt = (v: string | number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(v));

const fmtDate = (v: string) =>
    new Date(v).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

export default function TransactionShow({ transaction }: { transaction: Transaction }) {
    return (
        <>
            <Head title={`Transaksi ${transaction.no_inv}`} />

            <div className="flex h-full flex-1 flex-col gap-5 p-6">

                {/* Info cards row */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="rounded-2xl border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base text-slate-800">Informasi Invoice</CardTitle>
                            <CardDescription className="font-mono text-xs">{transaction.no_inv}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">No. Invoice</span>
                                <span className="font-mono font-medium">{transaction.no_inv}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tanggal</span>
                                <span className="font-medium">{fmtDate(transaction.tgl_inv)}</span>
                            </div>
                            <div className="flex justify-between border-t border-slate-100 pt-3">
                                <span className="font-semibold text-slate-700">Total</span>
                                <span className="text-lg font-bold text-blue-600">{fmt(transaction.total)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-3">
                            <CardTitle className="text-base text-slate-800">Informasi Customer</CardTitle>
                            <CardDescription className="text-xs">{transaction.kode_customer}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Kode</span>
                                <span className="font-medium">{transaction.kode_customer}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nama</span>
                                <span className="font-medium">{transaction.nama_customer}</span>
                            </div>
                            {transaction.alamat_customer && (
                                <div className="flex justify-between gap-4">
                                    <span className="shrink-0 text-slate-500">Alamat</span>
                                    <span className="text-right font-medium">{transaction.alamat_customer}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Detail table card */}
                <Card className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                            <CardTitle className="text-base text-slate-800">Detail Produk</CardTitle>
                            <CardDescription className="text-xs text-slate-500">{transaction.details.length} item produk</CardDescription>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => router.get(transactions.edit(transaction.id).url)}>
                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit Transaksi
                        </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                                    {['Kode', 'Nama Produk', 'Qty', 'Harga', 'Disc 1%', 'Disc 2%', 'Disc 3%', 'Harga Net', 'Jumlah'].map((h) => (
                                        <TableHead key={h} className="py-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{h}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.details.map((d, i) => (
                                    <TableRow key={d.id} className={`border-slate-100 ${i % 2 === 0 ? '' : 'bg-slate-50/40'}`}>
                                        <TableCell className="py-3 font-mono text-xs text-slate-500">{d.kode_produk}</TableCell>
                                        <TableCell className="py-3 font-medium">{d.nama_produk}</TableCell>
                                        <TableCell className="py-3 text-center">{d.qty}</TableCell>
                                        <TableCell className="py-3">{fmt(d.harga)}</TableCell>
                                        <TableCell className="py-3 text-center">{d.disc1}%</TableCell>
                                        <TableCell className="py-3 text-center">{d.disc2}%</TableCell>
                                        <TableCell className="py-3 text-center">{d.disc3}%</TableCell>
                                        <TableCell className="py-3 text-slate-600">{fmt(d.harga_net)}</TableCell>
                                        <TableCell className="py-3 font-bold text-slate-900">{fmt(d.jumlah)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Total */}
                <div className="flex justify-end">
                    <Card className="rounded-xl border-blue-100 bg-blue-50 shadow-sm">
                        <CardContent className="px-8 py-4 text-right">
                            <p className="text-xs font-semibold uppercase tracking-widest text-blue-400">Total Transaksi</p>
                            <p className="text-3xl font-bold text-blue-700">{fmt(transaction.total)}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

TransactionShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transaksi', href: '/transactions' },
        { title: 'Detail Transaksi', href: '#' },
    ],
};
