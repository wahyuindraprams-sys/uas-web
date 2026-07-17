import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AddressAutocomplete } from '@/components/address-autocomplete';
import * as customers from '@/routes/customers';

export default function CustomerCreate() {
    const { data, setData, post, processing, errors } = useForm({
        kode_customer: '',
        nama_customer: '',
        alamat: '',
        provinsi: '',
        kota: '',
        kecamatan: '',
        kelurahan: '',
        kode_pos: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(customers.store().url);
    };

    return (
        <>
            <Head title="Tambah Customer" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <Card className="max-w-2xl rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-800">Tambah Customer</CardTitle>
                                <CardDescription className="text-sm text-slate-500">
                                    Isi form di bawah untuk menambahkan customer baru.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Kode & Nama */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kode_customer">
                                        Kode Customer <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="kode_customer"
                                        value={data.kode_customer}
                                        onChange={(e) =>
                                            setData('kode_customer', e.target.value.replace(/[^a-zA-Z0-9]/g, ''))
                                        }
                                        placeholder="CUST001"
                                        maxLength={50}
                                    />
                                    {errors.kode_customer && (
                                        <p className="text-xs text-red-500">{errors.kode_customer}</p>
                                    )}
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="nama_customer">
                                        Nama Customer <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nama_customer"
                                        value={data.nama_customer}
                                        onChange={(e) => setData('nama_customer', e.target.value)}
                                        placeholder="Nama lengkap"
                                    />
                                    {errors.nama_customer && (
                                        <p className="text-xs text-red-500">{errors.nama_customer}</p>
                                    )}
                                </div>
                            </div>

                            {/* Alamat autocomplete */}
                            <AddressAutocomplete
                                id="alamat"
                                label="Alamat Lengkap"
                                value={data.alamat}
                                city={data.kota}
                                placeholder="Ketik alamat untuk mencari..."
                                onChange={(val) => setData('alamat', val)}
                                onSelect={(address, city) => {
                                    setData((prev) => ({
                                        ...prev,
                                        alamat: address,
                                        kota: city || prev.kota,
                                    }));
                                }}
                                error={errors.alamat}
                            />

                            {/* Kelurahan & Kecamatan */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kelurahan">Kelurahan</Label>
                                    <Input
                                        id="kelurahan"
                                        value={data.kelurahan}
                                        onChange={(e) => setData('kelurahan', e.target.value)}
                                        placeholder="Kelurahan"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="kecamatan">Kecamatan</Label>
                                    <Input
                                        id="kecamatan"
                                        value={data.kecamatan}
                                        onChange={(e) => setData('kecamatan', e.target.value)}
                                        placeholder="Kecamatan"
                                    />
                                </div>
                            </div>

                            {/* Kota & Provinsi */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="kota">Kota</Label>
                                    <Input
                                        id="kota"
                                        value={data.kota}
                                        onChange={(e) => setData('kota', e.target.value)}
                                        placeholder="Terisi otomatis / isi manual"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="provinsi">Provinsi</Label>
                                    <Input
                                        id="provinsi"
                                        value={data.provinsi}
                                        onChange={(e) => setData('provinsi', e.target.value)}
                                        placeholder="Provinsi"
                                    />
                                </div>
                            </div>

                            {/* Kode Pos */}
                            <div className="max-w-xs space-y-1.5">
                                <Label htmlFor="kode_pos">Kode Pos</Label>
                                <Input
                                    id="kode_pos"
                                    value={data.kode_pos}
                                    onChange={(e) => setData('kode_pos', e.target.value)}
                                    placeholder="12345"
                                    maxLength={10}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                >
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

CustomerCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Customer', href: '/customers' },
        { title: 'Tambah Customer', href: '/customers/create' },
    ],
};
