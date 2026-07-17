<?php

namespace App\Contracts\Repositories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;

interface CustomerRepositoryInterface
{
    public function all(): Collection;

    public function findById(int $id): ?Customer;

    public function findByKode(string $kode): ?Customer;

    public function create(array $data): Customer;

    public function update(Customer $customer, array $data): Customer;

    public function delete(Customer $customer): bool;
}
