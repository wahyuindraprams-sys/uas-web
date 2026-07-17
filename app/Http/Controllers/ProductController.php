<?php

namespace App\Http\Controllers;

use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function index(): Response
    {
        return Inertia::render('products/index', [
            'products' => $this->productRepository->all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('products/create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->productRepository->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil ditambahkan.']);

        return to_route('products.index');
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('products/edit', [
            'product' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->productRepository->update($product, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil diperbarui.']);

        return to_route('products.index');
    }

    public function destroy(Product $product): RedirectResponse
    {
        if ($product->hasTransactions()) {
            return back()->withErrors(['delete' => 'Produk tidak dapat dihapus karena sudah digunakan dalam transaksi.']);
        }

        $this->productRepository->delete($product);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Produk berhasil dihapus.']);

        return to_route('products.index');
    }
}
