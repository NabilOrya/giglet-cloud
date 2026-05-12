"use client"

import { useState } from "react"
import { FileSearch } from "lucide-react"
import { ReviewModal } from "./review-modal"

interface ReviewButtonProps {
  submission: {
    id: string
    notes: string | null
    fileUrl: string | null
    fileName: string | null
    status: string
  }
  studentName: string
}

export function ReviewButton({ submission, studentName }: ReviewButtonProps) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-3 rounded-xl bg-orange-500 text-white hover:opacity-90 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 text-sm font-bold"
      >
        <FileSearch className="h-4 w-4" />
        Review Work
      </button>

      {showModal && (
        <ReviewModal
          submission={submission}
          studentName={studentName}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            window.location.reload()
          }}
        />
      )}
    </>
  )
}
