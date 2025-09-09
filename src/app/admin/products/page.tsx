"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  price: string | number;
  stock: number;
  isActive: boolean;
}

interface ApiProductsResponse {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    price: any;
    stock: number;
    isActive: boolean;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function AdminProductsPage() {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/products?limit=50`);
      const data: ApiProductsResponse = await res.json();
      if (!res.ok) throw new Error("Failed to load products");
      const mapped = data.products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: typeof p.price === "string" ? p.price : String(p.price),
        stock: p.stock,
        isActive: p.isActive,
      }));
      setItems(mapped);
    } catch (e: any) {
      setError(e.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onDelete = async (slug: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${slug}`, { method: "DELETE" });
    if (res.ok) {
      setItems(prev => prev.filter(i => i.slug !== slug));
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Add Product
        </Link>
      </div>

      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border">Name</th>
              <th className="text-left p-2 border">Slug</th>
              <th className="text-left p-2 border">Price</th>
              <th className="text-left p-2 border">Stock</th>
              <th className="text-left p-2 border">Status</th>
              <th className="text-left p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td className="p-2 border">{item.name}</td>
                <td className="p-2 border">{item.slug}</td>
                <td className="p-2 border">{item.price}</td>
                <td className="p-2 border">{item.stock}</td>
                <td className="p-2 border">{item.isActive ? "Active" : "Inactive"}</td>
                <td className="p-2 border">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${item.slug}/edit`
                      }
                      className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => onDelete(item.slug)}
                      className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


