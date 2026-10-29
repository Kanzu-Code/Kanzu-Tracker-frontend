import React, { useState, useEffect, useRef } from 'react'

export default function SubmitModal({ milestone, onConfirm, onClose }) {
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => { textareaRef.current?.focus() }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = () => {
    if (!notes.trim()) {
      setError('Submission notes cannot be empty. Describe what you completed.')
      return
    }
    setError('')
    setLoading(true)
    try {
      onConfirm(notes.trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-[#0B2239] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-extrabold text-white tracking-tight">Submit Work</h2>
            <p className="text-sm text-[#94A3B8] mt-0.5">
              {milestone?.title ?? 'Week ' + milestone?.target_week + ' Milestone'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-white text-sm font-medium transition-colors"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div>
          <label htmlFor="submission-notes" className="block text-sm font-semibold text-white mb-1.5">
            Submission Notes / Links <span className="text-red-400">*</span>
          </label>
          <textarea
            id="submission-notes"
            ref={textareaRef}
            rows={5}
            value={notes}
            onChange={(e) => { setNotes(e.target.value); if (error) setError('') }}
            placeholder="Describe what you completed. Include relevant links such as GitHub, Figma, or documentation."
            className={'w-full bg-[#061424] rounded-xl border px-4 py-3 text-sm text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 resize-none leading-relaxed ' + (error ? 'border-red-500/50 focus:ring-red-500/25' : 'border-white/10 focus:ring-[#85C441]/30 focus:border-[#85C441]/40')}
          />
          {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-white/20 text-[#94A3B8] hover:text-white text-sm font-medium py-2.5 rounded-full hover:border-white/40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-[#85C441] hover:bg-[#72AB35] text-[#0B2239] text-sm font-bold py-2.5 rounded-full transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><Spinner /> Submitting...</> : 'Submit Work'}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}
