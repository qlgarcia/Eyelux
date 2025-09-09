"use client";
import { useRouter } from "next/navigation";
import { ProductForm, ProductFormValues } from "@/components/admin/product-form";

export default function AdminNewProductPage() {
  const router = useRouter();

  const handleSubmit = async (values: ProductFormValues) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        price: Number(values.price),
        images: values.images,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || "Failed to create product");
    }
    router.push("/admin/products");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Product</h1>
      <ProductForm onSubmit={handleSubmit} submitLabel="Create Product" />
    </div>
  );
}


