import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as products from '@/routes/products';

interface Product {
    id: number;
    kode_produk: string;
    nama_produk: string;
    harga: string;
    stok: number;
}

export default function ProductEdit({ product }: { product: Product }) {
    const { data, setData, put, processing, errors } = useForm({
        kode_produk: product.kode_produk,
        nama_produk: product.nama_produk,
        harga: product.harga,
        stok: String(product.stok),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(products.update(product.id).url);
    };

    return (
        <>
            <Head title="Edit Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="max-w-xl rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Edit Produk</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Perbarui informasi produk <span className="font-medium text-slate-700">{product.nama_produk}</span>.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="kode_produk">Kode Produk <span className="text-red-500">*</span></Label>
                                <Input
                                    id="kode_produk"
                                    value={data.kode_produk}
                                    onChange={(e) => setData('kode_produk', e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
                                    placeholder="Contoh: PRD001"
                                    maxLength={50}
                                />
                                {errors.kode_produk && <p className="text-xs text-red-500">{errors.kode_produk}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="nama_produk">Nama Produk <span className="text-red-500">*</span></Label>
                                <Input
                                    id="nama_produk"
                                    value={data.nama_produk}
                                    onChange={(e) => setData('nama_produk', e.target.value)}
                                    placeholder="Nama produk"
                                />
                                {errors.nama_produk && <p className="text-xs text-red-500">{errors.nama_produk}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="harga">Harga <span className="text-red-500">*</span></Label>
                                <Input
                                    id="harga"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.harga}
                                    onChange={(e) => setData('harga', e.target.value)}
                                    placeholder="0"
                                />
                                {errors.harga && <p className="text-xs text-red-500">{errors.harga}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="stok">Stok <span className="text-red-500">*</span></Label>
                                <Input
                                    id="stok"
                                    type="number"
                                    min="0"
                                    value={data.stok}
                                    onChange={(e) => setData('stok', e.target.value)}
                                    placeholder="0"
                                />
                                {errors.stok && <p className="text-xs text-red-500">{errors.stok}</p>}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button type="submit" disabled={processing} className="bg-amber-500 hover:bg-amber-600">
                                    Perbarui
                                </Button>
                                <Button type="button" variant="outline" onClick={() => history.back()}>
                                    Batal
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Produk', href: '/products' },
        { title: 'Edit Produk', href: '#' },
    ],
};
