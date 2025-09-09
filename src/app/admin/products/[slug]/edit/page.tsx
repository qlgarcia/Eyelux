"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/admin/product-form";

interface ProductApiResponse {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: any;
    stock: number;
    categoryId: string;
    images: string[];
    isActive: boolean;
  };
}

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [initial, setInitial] = useState<ProductFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/products/${params.slug}`);
        const data: ProductApiResponse = await res.json();
        if (!res.ok) throw new Error(data as any);
        const p = data.product;
        setInitial({
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: Number(p.price),
          stock: p.stock,
          categoryId: p.categoryId,
          images: Array.isArray(p.images) ? p.images : [],
          isActive: p.isActive,
        });
      } catch (e: any) {
        setError(e.message || "Failed to load product");
      }
    };
    if (params?.slug) load();
  }, [params?.slug]);

  const handleSubmit = async (values: ProductFormValues) => {
    const res = await fetch(`/api/products/${params.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        price: Number(values.price),
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update product");
    }
    router.push("/admin/products");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {initial && (
        <ProductForm initialValues={initial} onSubmit={handleSubmit} submitLabel="Update Product" />
      )}
    </div>
  );
}


