import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { ArrowRight, CheckCircle, GraduationCap, Briefcase, ShieldCheck } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-400/20 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-400/20 blur-[100px] rounded-full" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              The Marketplace for <span className="text-blue-600">Micro-Gigs</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
              Giglet connects talented students with businesses looking for fast, high-quality work. 
              Built for speed, reliability, and growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center group">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 bg-gray-50 dark:bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">A Platform for Everyone</h2>
              <p className="text-gray-600 dark:text-gray-400">Whether you're looking to earn or looking to hire, Giglet has you covered.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Student Role */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Students</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Build your portfolio, gain real-world experience, and earn while you study.</p>
                <ul className="space-y-3 mb-8">
                  {['Flexible work', 'Fast payouts', 'Build resume'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=STUDENT" className="block text-center text-blue-600 font-semibold hover:underline">Join as Student →</Link>
              </div>

              {/* Client Role */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">For Clients</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Get your micro-tasks done by top-tier student talent at competitive prices.</p>
                <ul className="space-y-3 mb-8">
                  {['Quick delivery', 'Quality work', 'Easy management'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=CLIENT" className="block text-center text-purple-600 font-semibold hover:underline">Hire Talent →</Link>
              </div>

              {/* Admin Role */}
              <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Governance</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Secure, moderated marketplace with full transparency and conflict resolution.</p>
                <ul className="space-y-3 mb-8">
                  {['Verified users', 'Secure payments', 'Support team'].map((item) => (
                    <li key={item} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <span className="block text-center text-gray-400 font-semibold">Admin Portal Only</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
