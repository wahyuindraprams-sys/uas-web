<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Repositories\CustomerRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return CustomerResource::collection($this->customerRepository->all());
    }

    public function store(StoreCustomerRequest $request): CustomerResource
    {
        $customer = $this->customerRepository->create($request->validated());

        return new CustomerResource($customer);
    }

    public function show(Customer $customer): CustomerResource
    {
        return new CustomerResource($customer);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): CustomerResource
    {
        $this->customerRepository->update($customer, $request->validated());

        return new CustomerResource($customer->fresh());
    }

    public function destroy(Customer $customer): JsonResponse
    {
        if ($customer->hasTransactions()) {
            return response()->json([
                'message' => 'Customer tidak dapat dihapus karena sudah memiliki transaksi.',
            ], 422);
        }

        $this->customerRepository->delete($customer);

        return response()->json(['message' => 'Customer berhasil dihapus.']);
    }
}
