<?php

namespace App\Repositories;

use App\Contracts\Repositories\TransactionRepositoryInterface;
use App\Models\Product;
use App\Models\TransactionDetail;
use App\Models\TransactionHeader;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TransactionRepository implements TransactionRepositoryInterface
{
    public function all(): Collection
    {
        return TransactionHeader::with('details')->orderByDesc('tgl_inv')->orderByDesc('no_inv')->get();
    }

    public function findById(int $id): ?TransactionHeader
    {
        return TransactionHeader::with('details')->find($id);
    }

    public function findByNoInv(string $noInv): ?TransactionHeader
    {
        return TransactionHeader::with('details')->where('no_inv', $noInv)->first();
    }

    public function create(array $headerData, array $detailsData): TransactionHeader
    {
        return DB::transaction(function () use ($headerData, $detailsData) {
            $header = TransactionHeader::create($headerData);

            foreach ($detailsData as $detail) {
                $detail['no_inv'] = $header->no_inv;
                TransactionDetail::create($detail);

                Product::where('kode_produk', $detail['kode_produk'])
                    ->decrement('stok', $detail['qty']);
            }

            $total = collect($detailsData)->sum('jumlah');
            $header->update(['total' => $total]);

            return $header->fresh(['details']);
        });
    }

    public function update(TransactionHeader $header, array $headerData, array $detailsData): TransactionHeader
    {
        return DB::transaction(function () use ($header, $headerData, $detailsData) {
            // Restore stock from old details
            foreach ($header->details as $oldDetail) {
                Product::where('kode_produk', $oldDetail->kode_produk)
                    ->increment('stok', $oldDetail->qty);
            }

            $header->details()->delete();
            $header->update($headerData);

            foreach ($detailsData as $detail) {
                $detail['no_inv'] = $header->no_inv;
                TransactionDetail::create($detail);

                Product::where('kode_produk', $detail['kode_produk'])
                    ->decrement('stok', $detail['qty']);
            }

            $total = collect($detailsData)->sum('jumlah');
            $header->update(['total' => $total]);

            return $header->fresh(['details']);
        });
    }

    public function delete(TransactionHeader $header): bool
    {
        return DB::transaction(function () use ($header) {
            foreach ($header->details as $detail) {
                Product::where('kode_produk', $detail->kode_produk)
                    ->increment('stok', $detail->qty);
            }

            $header->details()->delete();

            return $header->delete();
        });
    }

    public function getLastInvNumber(string $yearMonth): ?string
    {
        $last = TransactionHeader::withTrashed()
            ->where('no_inv', 'like', "INV/{$yearMonth}/%")
            ->orderByDesc('no_inv')
            ->value('no_inv');

        return $last;
    }
}
