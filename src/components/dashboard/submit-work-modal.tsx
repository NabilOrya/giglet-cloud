"use client"

import { useState } from "react"
import { createSubmission, getSubmissionUploadUrl } from "@/lib/actions"
import { Loader2, Upload, X, FileText, CheckCircle2 } from "lucide-react"

interface SubmitWorkModalProps {
  applicationId: string
  gigTitle: string
  onClose: () => void
  onSuccess: () => void
}

export function SubmitWorkModal({ applicationId, gigTitle, onClose, onSuccess }: SubmitWorkModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let fileKey = undefined
      let fileName = undefined

      if (file) {
        // 1. Get signed URL
        const { url, key } = await getSubmissionUploadUrl(file.name, file.type)
        
        // 2. Upload to S3
        const uploadRes = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        })

        if (!uploadRes.ok) throw new Error("File upload failed")
        
        fileKey = key
        fileName = file.name
      }

      // 3. Create database entry
      const result = await createSubmission({
        applicationId,
        notes,
        fileName,
        fileKey,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setSuccess(true)
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-card border border-border rounded-3xl p-8 max-w-md w-full text-center animate-in zoom-in duration-300">
          <div className="h-20 w-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Work Submitted!</h2>
          <p className="text-muted-foreground">Your submission has been sent to the client. The gig is now marked as completed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Submit Work</h2>
            <p className="text-muted-foreground text-sm">{gigTitle}</p>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-2xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              placeholder="Describe what you've completed..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 ml-1">
              Attach Files (PNG, PDF, DOCX, etc.)
            </label>
            <div className="relative group">
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-border group-hover:border-primary/50 group-hover:bg-primary/5 rounded-2xl p-8 text-center transition-all">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8 text-primary" />
                    <div className="text-left">
                      <p className="font-bold text-sm truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Upload className="h-6 w-6" />
                    </div>
                    <p className="font-bold mb-1">Click or drag to upload</p>
                    <p className="text-xs text-muted-foreground">Max file size 10MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-4 font-bold rounded-2xl border border-border hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] btn-primary py-4 font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Work"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
