export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <main className="flex flex-col items-center justify-center gap-8 p-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to FinMan
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          Your Personal Financial Manager
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Register
          </a>
        </div>
      </main>
    </div>
  );
}
