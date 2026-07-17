<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransactionHeader extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'no_inv',
        'kode_customer',
        'nama_customer',
        'alamat_customer',
        'tgl_inv',
        'total',
    ];

    protected $casts = [
        'tgl_inv' => 'date',
        'total' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'kode_customer', 'kode_customer');
    }

    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'no_inv', 'no_inv');
    }
}
