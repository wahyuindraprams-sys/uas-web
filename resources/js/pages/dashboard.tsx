import { Head } from '@inertiajs/react';
import { ClipboardList, PackageCheck, Route, Truck } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes';

const summaries = [
    {
        title: 'Order Hari Ini',
        value: '24',
        description: 'Order siap diproses',
        icon: PackageCheck,
    },
    {
        title: 'Rute Aktif',
        value: '8',
        description: 'Rute dalam pengiriman',
        icon: Route,
    },
    {
        title: 'Armada Siap',
        value: '12',
        description: 'Kendaraan tersedia',
        icon: Truck,
    },
];

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-slate-50 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Ringkasan singkat sistem manajemen rute.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {summaries.map((item) => (
                        <Card
                            key={item.title}
                            className="rounded-xl border-slate-200 bg-white shadow-sm"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">
                                    {item.title}
                                </CardTitle>
                                <div className="flex size-10 items-center justify-center rounded-lg bg-[#3517ff]/10 text-[#3517ff]">
                                    <item.icon className="size-5" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {item.value}
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                    {item.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-xl bg-[#3517ff]/10 text-[#3517ff]">
                                <ClipboardList className="size-5" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-slate-900">
                                    Selamat Datang
                                </CardTitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                            Sidebar saat ini hanya menampilkan Dashboard. Modul
                            lain bisa ditambahkan lagi saat backend dan route
                            project ini sudah disiapkan.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
