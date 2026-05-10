import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xs">
              Giglet is the ultimate micro-gig marketplace connecting talented students with clients looking for high-quality work.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Features</li>
              <li>How it works</li>
              <li>Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Help Center</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-500 text-sm">
          © {new Date().getFullYear()} Giglet. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
