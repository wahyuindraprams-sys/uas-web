<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\CustomerRepositoryInterface;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function __construct(
        private readonly CustomerRepositoryInterface $customerRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('customers/index', [
            'customers' => $this->customerRepository->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('customers/create');
    }

    public function store(StoreCustomerRequest $request): RedirectResponse
    {
        $this->customerRepository->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer berhasil ditambahkan.']);

        return to_route('customers.index');
    }

    public function edit(Customer $customer): Response
    {
        return Inertia::render('customers/edit', [
            'customer' => $customer,
        ]);
    }

    public function update(UpdateCustomerRequest $request, Customer $customer): RedirectResponse
    {
        $this->customerRepository->update($customer, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer berhasil diperbarui.']);

        return to_route('customers.index');
    }

    public function destroy(Customer $customer): RedirectResponse
    {
        if ($customer->hasTransactions()) {
            return back()->withErrors(['delete' => 'Customer tidak dapat dihapus karena sudah memiliki transaksi.']);
        }

        $this->customerRepository->delete($customer);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Customer berhasil dihapus.']);

        return to_route('customers.index');
    }
}
