<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'kode_customer',
        'nama_customer',
        'alamat',
        'provinsi',
        'kota',
        'kecamatan',
        'kelurahan',
        'kode_pos',
    ];

    public function transactionHeaders(): HasMany
    {
        return $this->hasMany(TransactionHeader::class, 'kode_customer', 'kode_customer');
    }

    public function hasTransactions(): bool
    {
        return $this->transactionHeaders()->exists();
    }
}
