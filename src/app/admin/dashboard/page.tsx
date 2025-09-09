"use client";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-6">Welcome, admin! This is your dashboard.</p>
      <div className="flex gap-4">
        <a
          href="/admin/products"
          className="inline-flex items-center px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Manage Products
        </a>
      </div>
    </div>
  );
}
