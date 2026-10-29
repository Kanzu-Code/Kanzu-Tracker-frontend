import React, { useState, useEffect, useRef } from 'react'

export default function SubmitModal({ milestone, onConfirm, onClose }) {
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async () => {
    if (!notes.trim()) {
      setError('Submission notes cannot be empty. Please describe what you have done.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await onConfirm(notes.trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 space-y-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Submit Work</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {milestone?.title ?? `Week ${milestone?.target_week} Milestone`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-sm font-medium leading-none mt-0.5"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>

        <div>
          <label
            htmlFor="submission-notes"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Submission Notes / Links <span className="text-red-500">*</span>
          </label>
          <textarea
            id="submission-notes"
            ref={textareaRef}
            rows={5}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value)
              if (error) setError('')
            }}
            placeholder="Describe what you completed. Include any relevant links such as GitHub, Figma, or documentation."
            className={`
              w-full rounded-xl border px-4 py-3 text-sm text-slate-800 placeholder-slate-400
              focus:outline-none focus:ring-2 resize-none leading-relaxed
              ${error
                ? 'border-red-400 focus:ring-red-300'
                : 'border-slate-300 focus:ring-orange-300 focus:border-orange-400'
              }
            `}
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 border border-slate-300 text-slate-700 text-sm font-medium py-2.5 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Spinner />
                Submitting...
              </>
            ) : (
              'Submit Work'
            )}
          </button>
        </div>
      </div>
    </Overlay>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
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
