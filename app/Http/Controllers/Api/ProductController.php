<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Repositories\ProductRepositoryInterface;
use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function __construct(
        private readonly ProductRepositoryInterface $productRepository
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return ProductResource::collection($this->productRepository->all());
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $product = $this->productRepository->create($request->validated());

        return new ProductResource($product);
    }

    public function show(Product $product): ProductResource
    {
        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $this->productRepository->update($product, $request->validated());

        return new ProductResource($product->fresh());
    }

    public function destroy(Product $product): JsonResponse
    {
        if ($product->hasTransactions()) {
            return response()->json([
                'message' => 'Produk tidak dapat dihapus karena sudah digunakan dalam transaksi.',
            ], 422);
        }

        $this->productRepository->delete($product);

        return response()->json(['message' => 'Produk berhasil dihapus.']);
    }
}
