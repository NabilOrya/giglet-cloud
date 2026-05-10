import Link from "next/link"
import { Rocket } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Rocket className="h-8 w-8 text-blue-600" />
      <span className="text-2xl font-bold tracking-tight">Giglet</span>
    </Link>
  )
}
