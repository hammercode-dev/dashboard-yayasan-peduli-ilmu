import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white">
      <AlertTriangle className="w-20 h-20 text-yellow-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">404 - Halaman Tidak Ditemukan</h1>
      <p className="text-gray-500 mb-6 max-w-md">Maaf, halaman yang kamu cari tidak tersedia atau sudah dipindahkan.</p>
      <Link
        to="/"
        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
