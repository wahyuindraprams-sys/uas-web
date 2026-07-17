import * as React from 'react';
import { PackageSearch, Plus, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppSelect } from '@/components/app-select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';

export interface ColumnDef<T> {
    header: React.ReactNode;
    accessorKey?: keyof T | string;
    cell?: (item: T) => React.ReactNode;
    className?: string;
}

export interface AppDataTableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    searchPlaceholder?: string;
    onAddClick?: () => void;
    addLabel?: string;
    defaultPerPage?: number;
    className?: string;
}

export function AppDataTable<T>({
    data,
    columns,
    searchPlaceholder = 'Cari data...',
    onAddClick,
    addLabel = 'Tambah Data',
    defaultPerPage = 10,
    className = '',
}: AppDataTableProps<T>) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(defaultPerPage);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, perPage]);

    const filteredData = React.useMemo(() => {
        if (!searchQuery.trim()) return data;
        const q = searchQuery.toLowerCase();
        return data.filter((item) =>
            Object.values(item as Record<string, unknown>)
                .map((v) => String(v).toLowerCase())
                .some((v) => v.includes(q)),
        );
    }, [data, searchQuery]);

    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / perPage) || 1;
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const paginatedData = React.useMemo(() => {
        const start = (safePage - 1) * perPage;
        return filteredData.slice(start, start + perPage);
    }, [filteredData, safePage, perPage]);

    const startRow = totalItems === 0 ? 0 : (safePage - 1) * perPage + 1;
    const endRow = Math.min(safePage * perPage, totalItems);

    const getPageNumbers = () => {
        const pages: (number | '...')[] = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= safePage - 1 && i <= safePage + 1)) {
                pages.push(i);
            } else if (i === safePage - 2 || i === safePage + 2) {
                pages.push('...');
            }
        }
        return pages.filter((item, idx, arr) => item !== '...' || arr[idx - 1] !== '...');
    };

    return (
        <div className={`flex flex-col gap-4 ${className}`}>

            {/* ── Toolbar card ── */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="h-10 rounded-xl border-slate-200 pl-10 text-sm focus-visible:ring-blue-500"
                    />
                </div>

                {onAddClick && (
                    <Button
                        onClick={onAddClick}
                        className="h-10 gap-2 rounded-xl bg-blue-600 px-5 font-semibold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 hover:shadow-blue-300"
                    >
                        <Plus className="h-4 w-4" />
                        {addLabel}
                    </Button>
                )}
            </div>

            {/* ── Table card ── */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* gradient accent strip */}
                <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-slate-100 bg-slate-50/70 hover:bg-slate-50/70">
                                {/* No. */}
                                <TableHead className="w-14 py-3.5 text-center text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                    No
                                </TableHead>
                                {columns.map((col, i) => (
                                    <TableHead
                                        key={i}
                                        className={`py-3.5 text-[11px] font-bold tracking-widest text-slate-400 uppercase ${col.className ?? ''}`}
                                    >
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((row, rowIdx) => (
                                    <TableRow
                                        key={rowIdx}
                                        className="group border-b border-slate-100 transition-colors last:border-0 hover:bg-blue-50/60"
                                    >
                                        {/* Nomor urut */}
                                        <TableCell className="py-3.5 text-center">
                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                {startRow + rowIdx}
                                            </span>
                                        </TableCell>

                                        {columns.map((col, colIdx) => (
                                            <TableCell
                                                key={colIdx}
                                                className={`py-3.5 text-sm text-slate-700 ${col.className ?? ''}`}
                                            >
                                                {col.cell
                                                    ? col.cell(row)
                                                    : col.accessorKey
                                                      ? (() => {
                                                            const v = row[col.accessorKey as keyof T];
                                                            return v !== undefined && v !== null ? String(v) : '—';
                                                        })()
                                                      : '—'}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length + 1} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                                                <PackageSearch className="h-8 w-8 opacity-50" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-500">
                                                    {searchQuery ? 'Tidak ada data yang cocok' : 'Belum ada data'}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {searchQuery
                                                        ? 'Coba kata kunci lain atau hapus filter.'
                                                        : 'Klik tombol tambah untuk mulai menambahkan data.'}
                                                </p>
                                            </div>
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="mt-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                                                >
                                                    Hapus pencarian
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex flex-col items-center justify-between gap-3 px-1 sm:flex-row">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Tampilkan</span>
                    <div className="w-16">
                        <AppSelect
                            type="default"
                            value={String(perPage)}
                            onChange={(v) => setPerPage(Number(v))}
                            options={[
                                { label: '5', value: '5' },
                                { label: '10', value: '10' },
                                { label: '25', value: '25' },
                                { label: '50', value: '50' },
                                { label: '100', value: '100' },
                            ]}
                            className="h-8 bg-white"
                        />
                    </div>
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {totalItems === 0
                            ? '0 data'
                            : `${startRow}–${endRow} dari ${totalItems} data`}
                    </span>
                </div>

                {totalPages > 1 && (
                    <Pagination className="mx-0 w-auto">
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (safePage > 1) setCurrentPage(safePage - 1);
                                    }}
                                    className={
                                        safePage === 1
                                            ? 'pointer-events-none opacity-40 select-none'
                                            : 'rounded-lg hover:bg-slate-100'
                                    }
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, idx) =>
                                page === '...' ? (
                                    <PaginationItem key={`e-${idx}`}>
                                        <PaginationEllipsis className="text-slate-400" />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            isActive={page === safePage}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page as number);
                                            }}
                                            className={
                                                page === safePage
                                                    ? 'rounded-lg border-transparent bg-blue-600 font-semibold text-white shadow shadow-blue-200 hover:bg-blue-700 hover:text-white'
                                                    : 'rounded-lg text-slate-600 hover:bg-slate-100'
                                            }
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (safePage < totalPages) setCurrentPage(safePage + 1);
                                    }}
                                    className={
                                        safePage === totalPages
                                            ? 'pointer-events-none opacity-40 select-none'
                                            : 'rounded-lg hover:bg-slate-100'
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
}
