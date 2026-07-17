<?php

namespace App\Repositories;

use App\Contracts\Repositories\CustomerRepositoryInterface;
use App\Models\Customer;
use Illuminate\Database\Eloquent\Collection;

class CustomerRepository implements CustomerRepositoryInterface
{
    public function all(): Collection
    {
        return Customer::orderBy('kode_customer')->get();
    }

    public function findById(int $id): ?Customer
    {
        return Customer::find($id);
    }

    public function findByKode(string $kode): ?Customer
    {
        return Customer::where('kode_customer', $kode)->first();
    }

    public function create(array $data): Customer
    {
        return Customer::create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        $customer->update($data);

        return $customer->fresh();
    }

    public function delete(Customer $customer): bool
    {
        return $customer->delete();
    }
}
