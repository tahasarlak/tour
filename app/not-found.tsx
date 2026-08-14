import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">۴۰۴</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-3">
        صفحه پیدا نشد
      </h2>
      <p className="text-gray-500 mb-8 max-w-md">
        متأسفانه صفحه‌ای که دنبالش بودید وجود ندارد یا حذف شده است.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}