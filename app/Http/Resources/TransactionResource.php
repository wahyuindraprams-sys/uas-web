<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'no_inv' => $this->no_inv,
            'kode_customer' => $this->kode_customer,
            'nama_customer' => $this->nama_customer,
            'alamat_customer' => $this->alamat_customer,
            'tgl_inv' => $this->tgl_inv?->toDateString(),
            'total' => (float) $this->total,
            'details' => TransactionDetailResource::collection($this->whenLoaded('details')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
