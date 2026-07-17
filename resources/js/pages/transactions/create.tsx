import { Head, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import * as transactions from '@/routes/transactions';

interface Product { id: number; kode_produk: string; nama_produk: string; harga: string; stok: number; }
interface Customer { id: number; kode_customer: string; nama_customer: string; }
interface DetailRow {
    kode_produk: string; nama_produk: string; qty: number; harga: number;
    disc1: number; disc2: number; disc3: number; harga_net: number; jumlah: number; stok_tersedia: number;
}
interface Props { products: Product[]; customers: Customer[]; no_inv: string; }

const fmt = (v: number) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(v);

function calcNet(h: number, d1: number, d2: number, d3: number) {
    return Math.round(h * (1 - d1 / 100) * (1 - d2 / 100) * (1 - d3 / 100) * 100) / 100;
}

const emptyRow = (): DetailRow => ({
    kode_produk: '', nama_produk: '', qty: 1, harga: 0,
    disc1: 0, disc2: 0, disc3: 0, harga_net: 0, jumlah: 0, stok_tersedia: 0,
});

export default function TransactionCreate({ products, customers, no_inv }: Props) {
    const [details, setDetails] = useState<DetailRow[]>([emptyRow()]);
    const { data, setData, post, processing, errors } = useForm<{
        kode_customer: string; tgl_inv: string; details: Omit<DetailRow, 'stok_tersedia'>[];
    }>({ kode_customer: '', tgl_inv: new Date().toISOString().split('T')[0], details: [] });

    useEffect(() => {
        setData('details', details.map(({ stok_tersedia: _, ...rest }) => rest));
    }, [details]);

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(transactions.store().url); };

    const updateDetail = (i: number, field: keyof DetailRow, value: string | number) => {
        setDetails((prev) => {
            const updated = [...prev];
            const row = { ...updated[i], [field]: value };
            if (field === 'kode_produk') {
                const p = products.find((p) => p.kode_produk === value);
                if (p) { row.nama_produk = p.nama_produk; row.harga = parseFloat(p.harga); row.stok_tersedia = p.stok; }
            }
            row.harga_net = calcNet(row.harga, row.disc1, row.disc2, row.disc3);
            row.jumlah = Math.round(row.harga_net * row.qty * 100) / 100;
            updated[i] = row;
            return updated;
        });
    };

    const total = details.reduce((s, d) => s + d.jumlah, 0);

    return (
        <>
            <Head title="Tambah Transaksi" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Header card */}
                    <Card className="rounded-2xl border-slate-200 shadow-sm">
                        <CardHeader className="border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-slate-800">Tambah Transaksi</CardTitle>
                                    <CardDescription className="text-sm text-slate-500">Buat transaksi penjualan baru.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 pt-5 md:grid-cols-3">
                            <div className="space-y-1.5">
                                <Label>No. Invoice</Label>
                                <Input value={no_inv} readOnly className="bg-slate-50 font-mono text-slate-500" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="tgl_inv">Tanggal Invoice <span className="text-red-500">*</span></Label>
                                <Input id="tgl_inv" type="date" value={data.tgl_inv} onChange={(e) => setData('tgl_inv', e.target.value)} />
                                {errors.tgl_inv && <p className="text-xs text-red-500">{errors.tgl_inv}</p>}
                            </div>
                            <div className="space-y-1.5">
                                <Label>Customer <span className="text-red-500">*</span></Label>
                                <Select value={data.kode_customer} onValueChange={(v) => setData('kode_customer', v)}>
                                    <SelectTrigger><SelectValue placeholder="Pilih customer..." /></SelectTrigger>
                                    <SelectContent>
                                        {customers.map((c) => (
                                            <SelectItem key={c.kode_customer} value={c.kode_customer}>
                                                {c.kode_customer} — {c.nama_customer}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.kode_customer && <p className="text-xs text-red-500">{errors.kode_customer}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Detail card */}
                    <Card className="rounded-2xl border-slate-200 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <CardTitle className="text-base text-slate-800">Detail Produk</CardTitle>
                                <CardDescription className="text-xs text-slate-500">Tambahkan produk yang dibeli.</CardDescription>
                            </div>
                            <Button type="button" size="sm" onClick={() => setDetails((p) => [...p, emptyRow()])}
                                className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4" /> Tambah Baris
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                                            <TableHead className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Produk</TableHead>
                                            <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-slate-400">Qty</TableHead>
                                            <TableHead className="w-36 text-[11px] font-bold uppercase tracking-wider text-slate-400">Harga</TableHead>
                                            <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-slate-400">Disc 1%</TableHead>
                                            <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-slate-400">Disc 2%</TableHead>
                                            <TableHead className="w-24 text-[11px] font-bold uppercase tracking-wider text-slate-400">Disc 3%</TableHead>
                                            <TableHead className="w-36 text-[11px] font-bold uppercase tracking-wider text-slate-400">Harga Net</TableHead>
                                            <TableHead className="w-36 text-[11px] font-bold uppercase tracking-wider text-slate-400">Jumlah</TableHead>
                                            <TableHead className="w-10" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {details.map((row, i) => (
                                            <TableRow key={i} className="border-slate-100 hover:bg-blue-50/40">
                                                <TableCell className="py-2">
                                                    <Select value={row.kode_produk} onValueChange={(v) => updateDetail(i, 'kode_produk', v)}>
                                                        <SelectTrigger className="min-w-[200px]"><SelectValue placeholder="Pilih produk..." /></SelectTrigger>
                                                        <SelectContent>
                                                            {products.map((p) => (
                                                                <SelectItem key={p.kode_produk} value={p.kode_produk}>
                                                                    {p.kode_produk} — {p.nama_produk} <span className="text-slate-400">(stok: {p.stok})</span>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {(errors as Record<string, string>)[`details.${i}.kode_produk`] && (
                                                        <p className="mt-1 text-xs text-red-500">{(errors as Record<string, string>)[`details.${i}.kode_produk`]}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-2">
                                                    <Input type="number" min={1} max={row.stok_tersedia || undefined} value={row.qty}
                                                        onChange={(e) => updateDetail(i, 'qty', parseInt(e.target.value) || 0)} className="w-20" />
                                                    {(errors as Record<string, string>)[`details.${i}.qty`] && (
                                                        <p className="mt-1 text-xs text-red-500">{(errors as Record<string, string>)[`details.${i}.qty`]}</p>
                                                    )}
                                                </TableCell>
                                                <TableCell className="py-2"><Input type="number" min={0} step="0.01" value={row.harga} onChange={(e) => updateDetail(i, 'harga', parseFloat(e.target.value) || 0)} className="w-32" /></TableCell>
                                                <TableCell className="py-2"><Input type="number" min={0} max={100} step="0.01" value={row.disc1} onChange={(e) => updateDetail(i, 'disc1', parseFloat(e.target.value) || 0)} className="w-20" /></TableCell>
                                                <TableCell className="py-2"><Input type="number" min={0} max={100} step="0.01" value={row.disc2} onChange={(e) => updateDetail(i, 'disc2', parseFloat(e.target.value) || 0)} className="w-20" /></TableCell>
                                                <TableCell className="py-2"><Input type="number" min={0} max={100} step="0.01" value={row.disc3} onChange={(e) => updateDetail(i, 'disc3', parseFloat(e.target.value) || 0)} className="w-20" /></TableCell>
                                                <TableCell className="py-2 text-sm font-medium text-slate-600">{fmt(row.harga_net)}</TableCell>
                                                <TableCell className="py-2 text-sm font-bold text-slate-800">{fmt(row.jumlah)}</TableCell>
                                                <TableCell className="py-2">
                                                    {details.length > 1 && (
                                                        <Button type="button" size="sm" variant="ghost"
                                                            onClick={() => setDetails((p) => p.filter((_, j) => j !== i))}>
                                                            <Trash2 className="h-4 w-4 text-red-400" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {errors.details && <p className="text-sm text-red-500">{errors.details}</p>}

                    {/* Action bar */}
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <Button type="submit" disabled={processing} className="bg-violet-600 hover:bg-violet-700">Simpan Transaksi</Button>
                            <Button type="button" variant="outline" onClick={() => history.back()}>Batal</Button>
                        </div>
                        <Card className="rounded-xl border-slate-200 shadow-sm">
                            <CardContent className="px-6 py-3 text-right">
                                <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Total</p>
                                <p className="text-2xl font-bold text-slate-900">{fmt(total)}</p>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

TransactionCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Transaksi', href: '/transactions' },
        { title: 'Tambah Transaksi', href: '/transactions/create' },
    ],
};
