export default function ClientDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Client Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Open Requests</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Spent</h3>
          <p className="text-3xl font-bold">$0.00</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Active Talent</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="mt-10 p-10 bg-purple-600 rounded-3xl text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Phase 1!</h2>
        <p className="opacity-90">Your client account is active. Talent hiring features are coming soon.</p>
      </div>
    </div>
  )
}
