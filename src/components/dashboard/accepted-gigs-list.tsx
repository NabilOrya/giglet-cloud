"use client"

import { useState } from "react"
import { SubmitWorkModal } from "./submit-work-modal"
import { Briefcase, CheckCircle2 } from "lucide-react"

interface AcceptedGig {
  id: string
  gig: {
    id: string
    title: string
    description: string
    budget: number
  }
  submission: any | null
}

export function AcceptedGigsList({ gigs }: { gigs: AcceptedGig[] }) {
  const [selectedApplication, setSelectedApplication] = useState<{ id: string, title: string } | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Accepted Gigs</h2>
        <span className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
          {gigs.length} Active
        </span>
      </div>

      {gigs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((app) => (
            <div 
              key={app.id} 
              className="card-gradient p-6 rounded-3xl border border-border/50 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-green-500/10 text-green-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  ${app.gig.budget}
                </span>
                {app.submission ? (
                  <span className="bg-blue-500/10 text-blue-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    Submitted
                  </span>
                ) : (
                  <span className="bg-orange-500/10 text-orange-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    In Progress
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold mb-2 line-clamp-1">{app.gig.title}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-grow">
                {app.gig.description}
              </p>
              
              {!app.submission ? (
                <button 
                  onClick={() => setSelectedApplication({ id: app.id, title: app.gig.title })}
                  className="btn-primary w-full py-3 text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Briefcase className="h-4 w-4" />
                  Submit Work
                </button>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 text-sm font-bold flex items-center justify-center gap-2 rounded-2xl bg-muted text-muted-foreground cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Submission Sent
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card-gradient p-10 rounded-3xl text-center border-dashed border-2 bg-muted/20">
          <p className="text-muted-foreground">No accepted gigs yet. Apply for more opportunities!</p>
        </div>
      )}

      {selectedApplication && (
        <SubmitWorkModal
          applicationId={selectedApplication.id}
          gigTitle={selectedApplication.title}
          onClose={() => setSelectedApplication(null)}
          onSuccess={() => {
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
