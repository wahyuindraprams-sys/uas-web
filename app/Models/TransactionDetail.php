<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    protected $fillable = [
        'no_inv',
        'kode_produk',
        'nama_produk',
        'qty',
        'harga',
        'disc1',
        'disc2',
        'disc3',
        'harga_net',
        'jumlah',
    ];

    protected $casts = [
        'qty' => 'integer',
        'harga' => 'decimal:2',
        'disc1' => 'decimal:2',
        'disc2' => 'decimal:2',
        'disc3' => 'decimal:2',
        'harga_net' => 'decimal:2',
        'jumlah' => 'decimal:2',
    ];

    public function header(): BelongsTo
    {
        return $this->belongsTo(TransactionHeader::class, 'no_inv', 'no_inv');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'kode_produk', 'kode_produk');
    }
}
