"use client";
import { useState } from "react";

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  slug: string;
  isActive: boolean;
}

interface ProductFormProps {
  initialValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel?: string;
}

export function ProductForm({ initialValues, onSubmit, submitLabel }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    price: typeof initialValues?.price === "number" ? initialValues!.price : 0,
    stock: typeof initialValues?.stock === "number" ? initialValues!.stock : 0,
    categoryId: initialValues?.categoryId || "",
    images: initialValues?.images || [],
    slug: initialValues?.slug || "",
    isActive: initialValues?.isActive ?? true,
  });

  const [imageInput, setImageInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof ProductFormValues, value: any) => {
    setValues(v => ({ ...v, [field]: value }));
  };

  const addImage = () => {
    const url = imageInput.trim();
    if (!url) return;
    setValues(v => ({ ...v, images: [...v.images, url] }));
    setImageInput("");
  };

  const removeImage = (idx: number) => {
    setValues(v => ({ ...v, images: v.images.filter((_, i) => i !== idx) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(values);
    } catch (e: any) {
      setError(e.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label className="block text-sm mb-1">Name</label>
        <input
          className="w-full border rounded p-2"
          value={values.name}
          onChange={e => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Slug</label>
        <input
          className="w-full border rounded p-2"
          value={values.slug}
          onChange={e => handleChange("slug", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea
          className="w-full border rounded p-2"
          rows={4}
          value={values.description}
          onChange={e => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={values.price}
            onChange={e => handleChange("price", Number(e.target.value))}
            min={0}
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Stock</label>
          <input
            type="number"
            className="w-full border rounded p-2"
            value={values.stock}
            onChange={e => handleChange("stock", Number(e.target.value))}
            min={0}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1">Category ID</label>
        <input
          className="w-full border rounded p-2"
          value={values.categoryId}
          onChange={e => handleChange("categoryId", e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Images</label>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder="https://..."
            value={imageInput}
            onChange={e => setImageInput(e.target.value)}
          />
          <button type="button" onClick={addImage} className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300">Add</button>
        </div>
        <ul className="space-y-2">
          {values.images.map((url, idx) => (
            <li key={idx} className="flex items-center justify-between border rounded p-2">
              <span className="truncate mr-2">{url}</span>
              <button type="button" onClick={() => removeImage(idx)} className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700">Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          checked={values.isActive}
          onChange={e => handleChange("isActive", e.target.checked)}
        />
        <label htmlFor="isActive">Active</label>
      </div>

      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Saving..." : (submitLabel || "Save Product")}
      </button>
    </form>
  );
}


