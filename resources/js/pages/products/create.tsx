import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import * as products from '@/routes/products';

export default function ProductCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_produk: '',
        nama_produk: '',
        harga: '',
        stok: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(products.store().url);
    };

    return (
        <>
            <Head title="Tambah Produk" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="max-w-xl rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Tambah Produk</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Isi form di bawah untuk menambahkan produk baru.
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
                                <Button type="submit" disabled={processing} className="bg-blue-600 hover:bg-blue-700">
                                    Simpan
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

ProductCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Produk', href: '/products' },
        { title: 'Tambah Produk', href: '/products/create' },
    ],
};
