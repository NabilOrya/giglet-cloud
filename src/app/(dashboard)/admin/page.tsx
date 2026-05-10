export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Console</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Users</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Pending Gigs</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Reports</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">System Status</h3>
          <p className="text-lg font-bold text-green-500">Healthy</p>
        </div>
      </div>

      <div className="mt-10 p-10 bg-green-600 rounded-3xl text-white text-center">
        <h2 className="text-2xl font-bold mb-2">Platform Administration</h2>
        <p className="opacity-90">Governance and moderation tools will be available here.</p>
      </div>
    </div>
  )
}
