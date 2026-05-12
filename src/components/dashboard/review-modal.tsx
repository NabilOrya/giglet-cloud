"use client"

import { useState } from "react"
import { reviewSubmission, getFileDownloadUrl } from "@/lib/actions"
import { X, CheckCircle2, RotateCcw, FileText, ExternalLink, Loader2 } from "lucide-react"

interface ReviewModalProps {
  submission: {
    id: string
    notes: string | null
    fileUrl: string | null
    fileName: string | null
    fileKey: string | null
    status: string
  }
  studentName: string
  onClose: () => void
  onSuccess: () => void
}

export function ReviewModal({ submission, studentName, onClose, onSuccess }: ReviewModalProps) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async () => {
    if (!submission.fileKey) return
    
    try {
      const url = await getFileDownloadUrl(submission.fileKey)
      window.open(url, "_blank")
    } catch (err) {
      setError("Failed to generate access link")
    }
  }

  const handleReview = async (action: "ACCEPT" | "REDO") => {
    setLoading(true)
    setError(null)
    
    const formData = new FormData()
    formData.append("submissionId", submission.id)
    formData.append("action", action)
    formData.append("feedback", feedback)

    try {
      const result = await reviewSubmission(formData)
      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
        onClose()
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Review Submission</h2>
            <p className="text-muted-foreground text-sm">Submitted by {studentName}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Submission Details</h3>
            
            {submission.notes && (
              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-2">Student Notes:</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.notes}</p>
              </div>
            )}

            {submission.fileKey ? (
              <div>
                <p className="text-sm font-medium text-foreground mb-2">Attached File:</p>
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all group text-left"
                >
                  <FileText className="h-6 w-6 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{submission.fileName || "Download Attachment"}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-tight">Click to preview securely</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No file attached</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
              Feedback for Student
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-2xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Great work! or Please fix the following..."
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={() => handleReview("REDO")}
              disabled={loading}
              className="flex-1 py-4 font-bold rounded-2xl border border-orange-500/20 text-orange-600 hover:bg-orange-500/10 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <RotateCcw className="h-5 w-5" />}
              Request Redo
            </button>
            <button
              onClick={() => handleReview("ACCEPT")}
              disabled={loading}
              className="flex-[2] btn-primary py-4 font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              Accept & Complete Gig
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
