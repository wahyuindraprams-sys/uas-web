<?php

namespace App\Services;

use App\Contracts\Repositories\TransactionRepositoryInterface;

class InvoiceNumberService
{
    public function __construct(
        private readonly TransactionRepositoryInterface $transactionRepository
    ) {}

    public function generate(): string
    {
        $yearMonth = now()->format('ym');
        $last = $this->transactionRepository->getLastInvNumber($yearMonth);

        if ($last === null) {
            $sequence = 1;
        } else {
            $parts = explode('/', $last);
            $sequence = (int) end($parts) + 1;
        }

        return sprintf('INV/%s/%04d', $yearMonth, $sequence);
    }
}
