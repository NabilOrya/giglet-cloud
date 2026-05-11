import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"
import { ArrowRight, CheckCircle, GraduationCap, Briefcase, ShieldCheck, Sparkles, Globe, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-8 animate-fade-in border border-primary/20">
              <Sparkles className="h-3 w-3" />
              <span>THE #1 MICRO-GIG MARKETPLACE FOR STUDENTS</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Unlock Your Potential with <br />
              <span className="text-primary bg-clip-text">Micro-Gigs</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
              Giglet connects talented students with innovative businesses. 
              Build your resume, earn extra income, and get tasks done faster.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup" className="w-full sm:w-auto btn-primary text-lg py-4 px-10 flex items-center justify-center group shadow-xl shadow-primary/20">
                Get Started 
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/gigs" className="w-full sm:w-auto btn-secondary text-lg py-4 px-10 flex items-center justify-center">
                Browse Gigs
              </Link>
            </div>
            
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {['Trusted by 500+ Students', '200+ Active Clients', 'Secure Payments', 'Verified Talent'].map((stat) => (
                <div key={stat} className="text-sm font-semibold">{stat}</div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-y border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Matching</h3>
                <p className="text-muted-foreground leading-relaxed">Find the perfect talent or gig in minutes with our optimized matching algorithm.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-14 w-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure Escrow</h3>
                <p className="text-muted-foreground leading-relaxed">Payments are held securely until the task is completed to your satisfaction.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6">
                <div className="h-14 w-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">Remote First</h3>
                <p className="text-muted-foreground leading-relaxed">Work from anywhere, anytime. Our platform is built for the modern remote workforce.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground text-lg">Whether you're looking to earn or hire, we have the tools you need.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Student Role */}
              <div className="card-gradient p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="h-32 w-32" />
                </div>
                <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-8">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Students</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">Build a professional portfolio while earning extra cash. Gain experience that top employers value.</p>
                <ul className="space-y-4 mb-10">
                  {['Curated Micro-tasks', 'Weekly Payouts', 'Portfolio Building'].map((item) => (
                    <li key={item} className="flex items-center text-sm font-medium">
                      <CheckCircle className="h-5 w-5 text-primary mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=STUDENT" className="btn-primary w-full text-center inline-block py-3">
                  Join as Student
                </Link>
              </div>

              {/* Client Role */}
              <div className="card-gradient p-10 rounded-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Briefcase className="h-32 w-32" />
                </div>
                <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-8">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Clients</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">Access a global pool of ambitious students. Get your tasks done efficiently and affordably.</p>
                <ul className="space-y-4 mb-10">
                  {['Verified Talent', 'Competitive Pricing', 'Escrow Protection'].map((item) => (
                    <li key={item} className="flex items-center text-sm font-medium">
                      <CheckCircle className="h-5 w-5 text-purple-500 mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/signup?role=CLIENT" className="btn-secondary w-full text-center inline-block py-3">
                  Hire Talent
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
