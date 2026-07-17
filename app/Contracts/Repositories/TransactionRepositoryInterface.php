<?php

namespace App\Contracts\Repositories;

use App\Models\TransactionHeader;
use Illuminate\Database\Eloquent\Collection;

interface TransactionRepositoryInterface
{
    public function all(): Collection;

    public function findById(int $id): ?TransactionHeader;

    public function findByNoInv(string $noInv): ?TransactionHeader;

    public function create(array $headerData, array $detailsData): TransactionHeader;

    public function update(TransactionHeader $header, array $headerData, array $detailsData): TransactionHeader;

    public function delete(TransactionHeader $header): bool;

    public function getLastInvNumber(string $yearMonth): ?string;
}
