import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get("id") ?? ""

  if (!id) {
    return Response.json({ ok: false, error: "Missing id query param" }, { status: 400 })
  }

  const env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAuthUrl: !!process.env.AUTH_URL,
    nodeEnv: process.env.NODE_ENV ?? null,
  }

  const prismaFind = await prisma.gig.findFirst({
    where: { id },
    select: { id: true, title: true, status: true, clientId: true, createdAt: true },
  })

  const rawCount = await prisma.$queryRaw<Array<{ c: number }>>`
    select count(*)::int as c
    from "gigs"
    where id::text = ${id}
  `

  const rawRow = await prisma.$queryRaw<
    Array<{ id: string; title: string; status: string; clientId: string; createdAt: Date }>
  >`
    select id, title, status, "clientId", "createdAt"
    from "gigs"
    where id::text = ${id}
    limit 1
  `

  return Response.json({
    ok: true,
    id,
    env,
    prismaFind,
    raw: {
      count: rawCount?.[0]?.c ?? null,
      row: rawRow?.[0] ?? null,
    },
  })
}

