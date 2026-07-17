<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'no_inv' => $this->no_inv,
            'kode_produk' => $this->kode_produk,
            'nama_produk' => $this->nama_produk,
            'qty' => $this->qty,
            'harga' => (float) $this->harga,
            'disc1' => (float) $this->disc1,
            'disc2' => (float) $this->disc2,
            'disc3' => (float) $this->disc3,
            'harga_net' => (float) $this->harga_net,
            'jumlah' => (float) $this->jumlah,
        ];
    }
}
