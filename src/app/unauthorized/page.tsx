import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-8 rounded-lg border border-red-100 max-w-md shadow-sm">
        <h1 className="text-3xl font-bold text-red-600 mb-4">403 - Access Denied</h1>
        <p className="text-gray-600 mb-6">
            You don't have the required permissions to access this page. 
            If you believe this is an error, please contact your system administrator.
        </p>
        <Link 
          href="/" 
          className="bg-[#FFD814] hover:bg-[#F7CA00] text-black px-6 py-2 rounded-full font-medium shadow-sm"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
